// src/features/chat/components/PresenceSidebar.tsx
import React from "react";
import { ChatPresenceState } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users2, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PresenceSidebarProps {
  onlineUsers: ChatPresenceState[];
  typingUsers: Record<string, string>;
  loading?: boolean;
}

export function PresenceSidebar({ onlineUsers, typingUsers, loading = false }: PresenceSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-muted/10 transition-colors duration-300">
      <div className="h-16 px-5 border-b border-border flex items-center justify-between shrink-0 bg-background/50 backdrop-blur-sm transition-colors duration-300">
        <h3 className="font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <Users2 className="w-4 h-4 text-muted-foreground" />
          Workspace
        </h3>
        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
          {loading ? "..." : onlineUsers.length} Online
        </span>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <div className="px-5 space-y-6">
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <CircleDot className="w-3 h-3 text-emerald-500" /> Active Now
            </h4>
            
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center p-2 -mx-2">
                    <div className="h-9 w-9 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="ml-3 space-y-1.5 flex-1">
                      <div className="h-3.5 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-2.5 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : onlineUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No one is online</p>
            ) : (
              <div className="space-y-1">
                {onlineUsers.map((user) => {
                  const isTyping = Object.keys(typingUsers).includes(user.user_id);
                  const initials = user.display_name.substring(0, 2).toUpperCase();

                  return (
                    <div 
                      key={user.user_id} 
                      className="flex items-center group p-2 -mx-2 rounded-xl hover:bg-background border border-transparent hover:border-border/60 hover:shadow-sm transition-all"
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback className="font-bold text-xs bg-muted text-foreground/70">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full shadow-sm transition-colors duration-300" />
                      </div>
                      
                      <div className="ml-3 overflow-hidden flex-1">
                        <p className="text-sm font-bold truncate text-foreground flex items-center justify-between">
                          <span className="truncate">{user.display_name}</span>
                          {user.hqid && (
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md ml-2 flex-shrink-0">
                              {user.hqid}
                            </span>
                          )}
                        </p>
                        {isTyping ? (
                          <p className="text-[11px] font-semibold text-primary animate-pulse truncate">
                            typing...
                          </p>
                        ) : (
                          <p className="text-[11px] font-medium text-muted-foreground truncate">
                            Online
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}