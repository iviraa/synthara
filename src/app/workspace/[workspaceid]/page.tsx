import ChatWrapper from "@/components/chat/ChatWrapper";
import WorkspaceRenderer from "@/components/WorkspaceRenderer";
import UploadButton from "@/components/UploadButton";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: Promise<{
    workspaceid: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { workspaceid } = await params;

  const { getUser } = getKindeServerSession();
  const user = getUser();

  const userId = (await user)?.id;

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
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden bg-canvas">
      <div className="mx-auto flex w-full min-h-0 max-w-8xl flex-1 flex-col lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col px-4 py-6 sm:px-6 lg:pl-8 lg:pr-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-caption uppercase tracking-[0.18em] text-slate">
                Workspace
              </p>
              <h1 className="mt-1 text-heading-sm font-medium text-ink-black">
                {workspace.name}
              </h1>
            </div>
            <UploadButton workspaceId={workspaceid} />
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <WorkspaceRenderer urlString={fileUrls} />
          </div>
        </div>

        <aside className="flex min-h-0 shrink-0 flex-col border-t border-ink-black/[0.06] lg:h-full lg:w-[420px] lg:border-l lg:border-t-0">
          <ChatWrapper workspaceId={workspaceid} />
        </aside>
      </div>
    </div>
  );
};

export default Page;
