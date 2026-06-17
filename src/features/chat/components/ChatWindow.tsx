// src/features/chat/components/ChatWindow.tsx
import React, { useRef, useEffect } from "react";
import { ChatMessageWithUser } from "./types";
import { MessageBubble } from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageSquareDashed } from "lucide-react";
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
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50/30">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-semibold text-neutral-400">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#FAFAFA]">
      <div 
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scrollbar-thin scrollbar-thumb-neutral-200"
        onScroll={handleScroll}
      >
        {loadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          </div>
        )}

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm mb-4">
              <MessageSquareDashed className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">No messages yet</h3>
            <p className="text-sm text-neutral-500 max-w-sm">
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
              <div className="flex items-center gap-2 text-[12px] font-semibold text-neutral-400 bg-white border border-neutral-100 rounded-full px-3 py-1 w-fit shadow-xs">
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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