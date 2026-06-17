import React from "react";
import { ChatMessageWithUser } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessageWithUser;
  isCurrentUser: boolean;
  showAvatar: boolean;
  isConsecutivePrev: boolean;
  isConsecutiveNext: boolean;
}

function parseMentions(content: string) {
  const mentionRegex = /(@[\w-]+)/g;
  const parts = content.split(mentionRegex);

  return parts.map((part, index) => {
    if (part.match(mentionRegex)) {
      return (
        <span key={index} className="text-primary font-medium bg-background/50 px-1 py-0.5 rounded shadow-sm">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function MessageBubble({
  message,
  isCurrentUser,
  showAvatar,
  isConsecutivePrev,
  isConsecutiveNext
}: MessageBubbleProps) {
  const { user } = message;

  const displayName = user?.display_name || "Unknown User";
  const initials = displayName.substring(0, 2).toUpperCase();

  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Dynamic border radius for clustered messages
  const bubbleStyles = cn(
    "px-4 py-2.5 max-w-full break-words shadow-sm text-[15px] leading-relaxed transition-all",
    isCurrentUser
      ? "bg-primary text-primary-foreground"
      : "bg-muted/60 text-foreground border border-border/40 backdrop-blur-sm",
    // Rounding logic
    "rounded-2xl",
    isCurrentUser && isConsecutivePrev && "rounded-tr-md",
    isCurrentUser && isConsecutiveNext && "rounded-br-md",
    !isCurrentUser && isConsecutivePrev && "rounded-tl-md",
    !isCurrentUser && isConsecutiveNext && "rounded-bl-md"
  );

  return (
    <div className={cn(
      "flex w-full max-w-[85%]", // Increased from 75% for wider chat area
      isCurrentUser ? "ml-auto justify-end" : "justify-start",
      isConsecutivePrev ? "mt-1" : "mt-6" // Grouping spacing
    )}>

      {!isCurrentUser && (
        <div className="flex-shrink-0 mr-5 flex flex-col justify-end">
          {showAvatar ? (
            <Avatar className="h-8 w-8 ring-1 ring-border/50 shadow-sm mb-1">
              <AvatarImage src={user?.avatar_url || ""} alt={displayName} />
              <AvatarFallback className="text-xs font-medium bg-muted text-muted-foreground">{initials}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-8" />
          )}
        </div>
      )}

      <div className={cn("flex flex-col min-w-0", isCurrentUser ? "items-end" : "items-start")}>
        {showAvatar && (
          <div className={cn("flex items-baseline gap-3 mb-1 px-8", isCurrentUser && "flex-row-reverse")}>
            <span className="text-sm font-medium text-foreground/90 tracking-tight">{displayName}</span>
            <span className="text-[11px] text-muted-foreground/70 font-medium">{time}</span>
          </div>
        )}

        <div className={bubbleStyles}>
          <div className="whitespace-pre-wrap">
            {parseMentions(message.content)}
          </div>
        </div>
      </div>
    </div>
  );
}