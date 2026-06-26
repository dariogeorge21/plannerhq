// src/features/chat/components/MessageBubble.tsx
import React from "react";
import { ChannelMessageWithUser } from "../types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChannelMessageWithUser;
  isCurrentUser: boolean;
  showAvatar: boolean;
  isConsecutivePrev: boolean;
  isConsecutiveNext: boolean;
  isFirstInGroup: boolean;
}

export function MessageBubble({
  message,
  isCurrentUser,
  showAvatar,
  isConsecutivePrev,
  isConsecutiveNext,
  isFirstInGroup
}: MessageBubbleProps) {
  const { user } = message;
  const displayName = user?.display_name || "Unknown";
  const initials = displayName.substring(0, 2).toUpperCase();

  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Modern Apple-like dynamic border radii
  const bubbleStyles = cn(
    "px-4 py-2.5 max-w-full break-words text-[15px] leading-relaxed shadow-sm transition-colors duration-300",
    isCurrentUser 
      ? "bg-primary text-primary-foreground" 
      : "bg-background border border-border/60 text-foreground shadow-foreground/5",
    
    // Base radius
    "rounded-[20px]",

    // Adjusting corners based on consecutive messages
    isCurrentUser && isConsecutiveNext && "rounded-br-[4px]",
    isCurrentUser && isConsecutivePrev && "rounded-tr-[4px]",
    !isCurrentUser && isConsecutiveNext && "rounded-bl-[4px]",
    !isCurrentUser && isConsecutivePrev && "rounded-tl-[4px]"
  );

  return (
    <div className={cn(
      "flex w-full group",
      isCurrentUser ? "justify-end pl-12" : "justify-start pr-12",
      isConsecutivePrev ? "mt-1" : "mt-6"
    )}>

      {!isCurrentUser && (
        <div className="flex-shrink-0 mr-3 flex flex-col justify-end w-8 relative">
          {showAvatar ? (
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-muted to-muted/50 border border-border/50 flex items-center justify-center font-bold text-[10px] text-foreground/70 shadow-sm sticky bottom-0 transition-colors duration-300">
              {initials}
            </div>
          ) : null}
        </div>
      )}

      <div className={cn("flex flex-col min-w-0 max-w-[85%]", isCurrentUser ? "items-end" : "items-start")}>
        {!isCurrentUser && isFirstInGroup && (
          <div className="flex items-baseline gap-2 mb-1.5 ml-1">
            <span className="text-sm font-bold text-foreground tracking-tight transition-colors duration-300">{displayName}</span>
            <span className="text-[11px] font-semibold text-muted-foreground transition-colors duration-300">{time}</span>
          </div>
        )}
        
        <div className="flex items-end gap-2 relative">
          <div className={bubbleStyles}>
            {message.content}
          </div>
          
          {/* Subtle time reveal on hover for current user */}
          {isCurrentUser && (
            <span className="text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute right-full mr-3 bottom-2 whitespace-nowrap">
              {time}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}