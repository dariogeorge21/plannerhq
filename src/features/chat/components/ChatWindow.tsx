// src/features/chat/components/ChatWindow.tsx
import React, { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageSquareDashed } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { ChannelMessageWithUser } from "../types";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  messages: ChannelMessageWithUser[];
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
  if (typingArray.length === 1) typingText = `${typingArray[0]} is typing...`;
  else if (typingArray.length === 2) typingText = `${typingArray.join(" and ")} are typing...`;
  else if (typingArray.length > 2) typingText = "Multiple people are typing...";

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-background/50">
        <div className="flex-1 px-4 md:px-6 py-6 flex flex-col justify-end gap-6 overflow-hidden">
          {/* Incoming skeleton message */}
          <div className="flex justify-start pr-12">
            <div className="flex-shrink-0 mr-3 w-8 flex items-end">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0 max-w-[85%] items-start">
              <div className="flex items-baseline gap-2 mb-1.5 ml-1">
                <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
                <div className="h-2.5 w-12 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-10 w-48 bg-muted animate-pulse rounded-[20px] rounded-bl-[4px]" />
            </div>
          </div>
          {/* Outgoing skeleton message */}
          <div className="flex justify-end pl-12 mt-4">
             <div className="flex flex-col min-w-0 max-w-[85%] items-end">
               <div className="h-14 w-64 bg-primary/20 animate-pulse rounded-[20px] rounded-br-[4px]" />
             </div>
          </div>
          {/* Incoming skeleton message group */}
          <div className="flex justify-start pr-12 mt-4">
            <div className="flex-shrink-0 mr-3 w-8 flex items-end" />
            <div className="flex flex-col min-w-0 max-w-[85%] items-start">
              <div className="flex items-baseline gap-2 mb-1.5 ml-1">
                <div className="h-3.5 w-32 bg-muted animate-pulse rounded" />
                <div className="h-2.5 w-10 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-10 w-56 bg-muted animate-pulse rounded-[20px] rounded-bl-[4px]" />
            </div>
          </div>
          <div className="flex justify-start pr-12 mt-1">
            <div className="flex-shrink-0 mr-3 w-8 flex items-end">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0 max-w-[85%] items-start">
              <div className="h-16 w-40 bg-muted animate-pulse rounded-[20px] rounded-tl-[4px] rounded-bl-[4px]" />
            </div>
          </div>
        </div>
        <div className="p-4 md:px-6 md:pb-6 shrink-0 opacity-50 pointer-events-none">
           <div className="h-14 bg-muted animate-pulse rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background/50 dark:bg-background transition-colors duration-300">
      <div 
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scrollbar-thin scrollbar-thumb-muted-foreground/20"
        onScroll={handleScroll}
      >
        {loadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center shadow-sm mb-4 transition-colors duration-300">
              <MessageSquareDashed className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1 transition-colors">No messages yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm transition-colors">
              Be the first to break the ice. Start a conversation with your team here.
            </p>
          </div>
        )}

        <div className="flex flex-col justify-end min-h-full">
          {messages.map((message, idx) => {
            const isCurrentUser = message.user_id === currentUserId;
            const isConsecutivePrev = idx > 0 && messages[idx - 1].user_id === message.user_id;
            const isConsecutiveNext = idx < messages.length - 1 && messages[idx + 1].user_id === message.user_id;
            const showAvatar = !isConsecutiveNext; // Show avatar on the LAST message of a group to anchor it

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser}
                showAvatar={showAvatar}
                isConsecutivePrev={isConsecutivePrev}
                isConsecutiveNext={isConsecutiveNext}
                isFirstInGroup={!isConsecutivePrev}
              />
            );
          })}
          
          <div className="h-6 mt-3 ml-12">
            {typingText && (
              <div className="flex items-center gap-2 text-[12px] font-semibold text-muted-foreground bg-background border border-border rounded-full px-3 py-1 w-fit shadow-xs transition-colors">
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                {typingText}
              </div>
            )}
          </div>
          
          <div ref={endRef} className="h-1" />
        </div>
      </div>

      <ChatInput onSendMessage={onSendMessage} onTyping={onTyping} />
    </div>
  );
}