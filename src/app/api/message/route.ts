import { db } from "@/db";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest } from "next/server";

import { OpenAIStream, StreamingTextResponse } from "ai";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = getUser();
  const usersId = (await user).id;
  console.log("usersId", usersId);

  const { id: userId } = await user;
  console.log("userId", userId);

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { message, workspaceId } = SendMessageValidator.parse(body);

  const workspaceFiles = await db.file.findMany({
    where: {
      workspaceId,
      userId,
    },
    select: { id: true },
  });

  if (!workspaceFiles.length)
    return new Response("Files not found", { status: 404 });

  const fileIds = workspaceFiles.map((file) => file.id);

  await db.message.create({
    data: {
      workspaceId,
      text: message,
      isUserMessage: true,
      userId,
    },
  });

  const pineconeIndex = pinecone.Index("synthara");

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  //   //@ts-ignore
  //   pineconeIndex,
  //   namespace: workspaceId,
  // });

  // const allresults = await vectorStore.similaritySearch(message, 4);

  let allContexts: string[] = [];

  for (const fileId of fileIds) {
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      //@ts-ignore
      pineconeIndex,
      namespace: fileId, // Using fileId as namespace for each file
    });

    const results = await vectorStore.similaritySearch(message, 4);
    allContexts.push(...results.map((r) => r.pageContent));
  }

  const prevMessages = await db.message.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
   ${allContexts.join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response as any, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          workspaceId,
          userId,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
