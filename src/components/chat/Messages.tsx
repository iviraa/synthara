import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/inifinite-query";
import { Loader2, MessageSquare } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Message from "./Message";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { useIntersection } from "@mantine/hooks";

interface MessagesProps {
  workspaceId: string;
}

const Messages = ({ workspaceId }: MessagesProps) => {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, isLoading, fetchNextPage } =
    trpc.getWorkspaceMessages.useInfiniteQuery(
      {
        workspaceId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className="scrollbar-hide flex min-h-0 flex-1 flex-col-reverse gap-3 overflow-y-auto px-5 pb-2 pt-6 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage;

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                ref={ref}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
                key={message.id}
              />
            );
          }
          return (
            <Message
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
              key={message.id}
            />
          );
        })
      ) : isLoading ? (
        <div className="flex w-full flex-col gap-3">
          <Skeleton height={56} borderRadius={20} />
          <Skeleton height={56} borderRadius={20} />
          <Skeleton height={56} borderRadius={20} />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-ink-black/[0.04]">
            <MessageSquare className="size-5 text-ink-black" strokeWidth={1.5} />
          </span>
          <h3 className="text-heading-sm font-medium text-ink-black">
            You are all set
          </h3>
          <p className="max-w-[28ch] text-body-sm text-graphite">
            Ask anything about the documents in this workspace to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
