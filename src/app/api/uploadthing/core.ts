import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({
    pdf: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = getUser();
      const id = (await user).id;

      if (!(await user).id || !(await user).email)
        throw new Error("UNAUTHORIZED");

      return { userId: id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(file.url);

        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();

        const pineconeIndex = pinecone.Index("synthara");

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          //@ts-ignore
          pineconeIndex,
          namespace: createdFile.id,
        });

        await db.file.update({
          where: {
            id: createdFile.id,
          },
          data: {
            uploadStatus: "SUCCESS",
          },
        });
      } catch (error) {
        await db.file.update({
          where: {
            id: createdFile.id,
          },
          data: {
            uploadStatus: "FAILED",
          },
        });
      }
    }),
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user?.id) throw new Error("UNAUTHORIZED");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const workspace = await db.workspace.findFirst({
          where: { userId: metadata.userId },
          select: { id: true },
        });

        if (!workspace) throw new Error("Workspace not found for this user");

        await db.workspace.update({
          where: {
            id: workspace.id,
          },
          data: {
            imageUrl: file.url,
          },
        });
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
