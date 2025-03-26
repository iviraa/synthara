import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="shrink-0 px-4 pb-4 pt-2">
      <div className="frost-card mx-auto flex max-w-3xl items-end gap-2 p-2">
        <Textarea
          rows={1}
          ref={textareaRef}
          maxRows={5}
          autoFocus
          onChange={handleInputChange}
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addMessage();
              textareaRef.current?.focus();
            }
          }}
          disabled={isDisabled}
          placeholder="Ask anything about this workspace"
          className="scrollbar-hide min-h-[44px] resize-none border-none bg-transparent px-4 py-3 text-body text-ink-black placeholder:text-slate focus-visible:ring-0 focus-visible:ring-offset-0 scrolling-touch"
        />
        <Button
          disabled={isLoading || isDisabled || !message.trim()}
          onClick={() => {
            addMessage();
            textareaRef.current?.focus();
          }}
          variant="solid"
          size="icon"
          aria-label="Send message"
          className="self-end"
        >
          <ArrowUp className="size-4" strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
