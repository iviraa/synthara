import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";

import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { forwardRef } from "react";
import { Icons } from "../Icons";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    const isUser = message.isUserMessage;

    return (
      <div
        ref={ref}
        className={cn("flex items-end gap-2", {
          "justify-end": isUser,
        })}
      >
        <div
          className={cn(
            "flex aspect-square size-7 shrink-0 items-center justify-center rounded-full",
            {
              "order-2 bg-ink-black": isUser,
              "order-1 bg-ink-black/[0.06]": !isUser,
              invisible: isNextMessageSamePerson,
            }
          )}
          aria-hidden
        >
          {isUser ? (
            <Icons.user className="size-3.5 fill-snow text-snow" />
          ) : (
            <span className="block size-2.5 rotate-45 rounded-[1px] bg-spectrum" />
          )}
        </div>

        <div
          className={cn("flex max-w-[78%] flex-col gap-1", {
            "order-1 items-end": isUser,
            "order-2 items-start": !isUser,
          })}
        >
          <div
            className={cn(
              "rounded-[20px] px-4 py-2.5 text-body-sm leading-[1.5]",
              {
                "bg-ink-black text-snow": isUser,
                "bg-snow/90 text-ink-black shadow-soft backdrop-blur-frost":
                  !isUser,
              }
            )}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn(
                  "prose prose-sm max-w-none",
                  "prose-p:my-1 prose-p:leading-[1.55]",
                  "prose-strong:font-medium",
                  "prose-code:text-[0.85em] prose-code:font-normal prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
                  "prose-ol:my-1 prose-ul:my-1 prose-li:my-0",
                  isUser
                    ? cn(
                        "prose-invert",
                        "prose-p:text-snow prose-li:text-snow prose-strong:text-snow",
                        "prose-headings:text-snow prose-a:text-snow",
                        "prose-code:bg-snow/15 prose-code:text-snow"
                      )
                    : cn(
                        "prose-p:text-ink-black prose-li:text-ink-black",
                        "prose-strong:text-ink-black prose-headings:text-ink-black",
                        "prose-a:text-ink-black",
                        "prose-code:bg-ink-black/[0.06] prose-code:text-ink-black"
                      )
                )}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
          </div>
          {message.id !== "loading-message" ? (
            <span
              className={cn("px-1 text-caption", {
                "text-slate": !isUser,
                "text-ink-black/45": isUser,
              })}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;
