// src/features/chat/components/ChatInput.tsx
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SendIcon, Sparkles } from "lucide-react";
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
      onSendMessage(content.trim());
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
    <div className="p-4 md:px-6 md:pb-6 bg-background/50 dark:bg-background shrink-0 transition-colors duration-300">
      <div
        className={cn(
          "relative flex items-end p-2 bg-muted/30 border border-border rounded-2xl transition-all duration-300 shadow-sm",
          "focus-within:bg-background focus-within:border-primary/40 focus-within:shadow-md focus-within:ring-4 focus-within:ring-primary/10"
        )}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message your workspace..."
          className="w-full min-h-[44px] max-h-[150px] resize-none bg-transparent border-0 focus:ring-0 px-3 py-3 text-[15px] font-medium leading-relaxed placeholder:text-muted-foreground scrollbar-thin outline-none text-foreground transition-colors"
          rows={1}
        />

        <div className="flex shrink-0 mb-1 ml-2">
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!hasContent}
            className={cn(
              "h-10 w-10 rounded-xl transition-all duration-300",
              hasContent
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105"
                : "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
            )}
          >
            <SendIcon className={cn("h-4 w-4", hasContent && "translate-x-0.5")} />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 px-2">
        <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 transition-colors">
          <span className="px-1.5 py-0.5 rounded border border-border bg-muted/50 font-bold text-foreground">↵</span> to send
          <span className="px-1.5 py-0.5 rounded border border-border bg-muted/50 font-bold ml-1 text-foreground">⇧ ↵</span> to add a new line
        </p>
        <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
          <Sparkles className="w-3 h-3" /> End-to-end secured
        </p>
      </div>
    </div>
  );
}