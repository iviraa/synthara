"use client";

import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Messages from "./Messages";
import { ChatContextProvider } from "./ChatContext";

interface ChatWrapperProps {
  workspaceId: string;
}

const ChatWrapper = ({ workspaceId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getWorkspaceStatus.useQuery({
    id: workspaceId,
  });

  if (isLoading) {
    return (
      <Shell>
        <Centered>
          <Loader2 className="size-6 animate-spin text-ink-black" strokeWidth={1.5} />
          <h3 className="text-heading-sm font-medium text-ink-black">
            Loading...
          </h3>
          <p className="text-body-sm text-graphite">
            We are preparing your workspace.
          </p>
        </Centered>
        <ChatInput isDisabled />
      </Shell>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <Shell>
        <Centered>
          <Loader2 className="size-6 animate-spin text-ink-black" strokeWidth={1.5} />
          <h3 className="text-heading-sm font-medium text-ink-black">
            Processing your PDF
          </h3>
          <p className="text-body-sm text-graphite">This will not take long.</p>
        </Centered>
        <ChatInput isDisabled />
      </Shell>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <Shell>
        <Centered>
          <XCircle className="size-6 text-spectrum-red" strokeWidth={1.5} />
          <h3 className="text-heading-sm font-medium text-ink-black">
            Could not index this file
          </h3>
          <p className="max-w-[36ch] text-body-sm text-graphite">
            The PDF may be too long for the free plan, or the upload failed
            partway. Try again or pick another document.
          </p>
          <Link
            href="/workspace"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ChevronLeft className="size-4" strokeWidth={1.5} />
            Back to workspaces
          </Link>
        </Centered>
        <ChatInput isDisabled />
      </Shell>
    );
  }

  return (
    <ChatContextProvider workspaceId={workspaceId}>
      <Shell>
        <Messages workspaceId={workspaceId} />
        <ChatInput />
      </Shell>
    </ChatContextProvider>
  );
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-canvas">
      {children}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      {children}
    </div>
  );
}

export default ChatWrapper;
