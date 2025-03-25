import ChatWrapper from "@/components/chat/ChatWrapper";
import WorkspaceRenderer from "@/components/WorkspaceRenderer";
import UploadButton from "@/components/UploadButton";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    workspaceid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { workspaceid } = await params;

  const { getUser } = getKindeServerSession();
  const user = getUser();

  const userId = (await user).id;

  if (!(await user) || !(await user).email)
    redirect(`/auth-callback/?origin=workspace/${workspaceid}`);

  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceid,
      userId: userId,
    },
    include: {
      File: true,
    },
  });

  if (!workspace) notFound();

  const fileUrls = workspace.File.map((file) => file.url);

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            <WorkspaceRenderer urlString={fileUrls} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper workspaceId={workspaceid} />
        </div>
      </div>

      {/* Floating Upload Button */}
      <div className="fixed top-[calc(3.5rem+1rem)] right-4 z-50">
        <UploadButton workspaceId={workspaceid} />
      </div>
    </div>
  );
};

export default Page;
