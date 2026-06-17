import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTyping: () => void;
}

export function ChatInput({ onSendMessage, onTyping }: ChatInputProps) {
  const [content, setContent] = React.useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasContent = content.trim().length > 0;

  const handleSend = () => {
    if (hasContent) {
      onSendMessage(content);
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onTyping();
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="p-4 bg-gradient-to-t from-background via-background to-transparent pt-6 border-t border-border/40">
      <div className="max-w-4xl mx-auto flex flex-col">
        <div
          className={cn(
            "flex items-end space-x-2 relative rounded-2xl border bg-muted/20 p-2 transition-all duration-200 shadow-sm",
            "focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30"
          )}
        >
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[40px] max-h-[150px] resize-none border-0 focus-visible:ring-0 bg-transparent py-2.5 px-2 w-full scrollbar-thin text-[15px] leading-relaxed"
            rows={1}
          />

          <Button
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full flex-shrink-0 transition-all duration-200 mb-0.5",
              hasContent
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 scale-100"
                : "bg-muted text-muted-foreground scale-95 opacity-50 cursor-not-allowed"
            )}
            disabled={!hasContent}
            onClick={handleSend}
          >
            <SendIcon className={cn("h-4 w-4", hasContent && "translate-x-0.5")} />
            <span className="sr-only">Send</span>
          </Button>
        </div>

        <div className="flex justify-between items-center mt-2 px-1">
          <p className="text-[11px] text-muted-foreground/60 font-medium">
            <strong>@</strong> to mention • <strong>Shift + Enter</strong> for new line
          </p>
        </div>
      </div>
    </div>
  );
}