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
    <div className="p-4 md:px-6 md:pb-6 bg-white shrink-0">
      <div
        className={cn(
          "relative flex items-end p-2 bg-neutral-50 border border-neutral-200 rounded-2xl transition-all duration-300 shadow-sm",
          "focus-within:bg-white focus-within:border-indigo-300 focus-within:shadow-md focus-within:ring-4 focus-within:ring-indigo-500/10"
        )}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message your workspace..."
          className="w-full min-h-[44px] max-h-[150px] resize-none bg-transparent border-0 focus:ring-0 px-3 py-3 text-[15px] font-medium leading-relaxed placeholder:text-neutral-400 scrollbar-thin outline-none"
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
                ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:scale-105"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            <SendIcon className={cn("h-4 w-4", hasContent && "translate-x-0.5")} />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 px-2">
        <p className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded border border-neutral-200 bg-neutral-100 font-bold">↵</span> to send
          <span className="px-1.5 py-0.5 rounded border border-neutral-200 bg-neutral-100 font-bold ml-1">⇧ ↵</span> to add a new line
        </p>
        <p className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 hover:text-indigo-500 cursor-pointer transition-colors">
          <Sparkles className="w-3 h-3" /> End-to-end secured
        </p>
      </div>
    </div>
  );
}