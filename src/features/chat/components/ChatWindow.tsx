import React, { useRef, useEffect } from "react";
import { ChatMessageWithUser } from "../types";
import { MessageBubble } from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessagesSquare } from "lucide-react";
import { ChatInput } from "./ChatInput";

interface ChatWindowProps {
  messages: ChatMessageWithUser[];
  currentUserId?: string;
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  onSendMessage: (content: string) => void;
  onTyping: () => void;
  typingUsers?: Record<string, string>;
}

export function ChatWindow({
  messages,
  currentUserId,
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
  onSendMessage,
  onTyping,
  typingUsers = {}
}: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadingMore && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loadingMore, typingUsers]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop === 0 && hasMore && !loadingMore) {
      onLoadMore();
    }
  };

  const typingArray = Object.values(typingUsers);
  let typingText = "";
  if (typingArray.length === 1) {
    typingText = `${typingArray[0]} is typing...`;
  } else if (typingArray.length === 2) {
    typingText = `${typingArray[0]} and ${typingArray[1]} are typing...`;
  } else if (typingArray.length > 2) {
    typingText = "Several people are typing...";
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/95">
        <div className="flex flex-col items-center text-muted-foreground animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary/60" />
          <p className="text-sm font-medium">Securing connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-4 md:px-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex flex-col"
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        {loadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/60" />
          </div>
        )}

        {!hasMore && (
          <div className="flex flex-col items-center justify-center py-12 mt-auto mb-4 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessagesSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Welcome to the channel</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              This is the beginning of your workspace chat.
            </p>
          </div>
        )}

        <div className="flex flex-col pb-2">
          {messages.map((message, idx) => {
            const isCurrentUser = message.user_id === currentUserId;

            // Check consecutive messages for grouping (Gestalt Proximity)
            const isConsecutivePrev = idx > 0 && messages[idx - 1].user_id === message.user_id;
            const isConsecutiveNext = idx < messages.length - 1 && messages[idx + 1].user_id === message.user_id;
            const showAvatar = !isConsecutivePrev; // Only show on first message of a block

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser}
                showAvatar={showAvatar}
                isConsecutivePrev={isConsecutivePrev}
                isConsecutiveNext={isConsecutiveNext}
              />
            );
          })}
          
          {/* Typing Indicator in chat area */}
          <div className="h-6 mt-2 ml-12">
            {typingText && (
              <p className="text-[12px] text-muted-foreground/80 italic animate-pulse">
                {typingText}
              </p>
            )}
          </div>
          
          <div ref={endRef} className="h-1" />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={onSendMessage} onTyping={onTyping} />
    </div>
  );
}