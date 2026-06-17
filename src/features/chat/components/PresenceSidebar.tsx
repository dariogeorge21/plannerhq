import React from "react";
import { ChatPresenceState } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users2Icon } from "lucide-react";

interface PresenceSidebarProps {
  onlineUsers: ChatPresenceState[];
  typingUsers: Record<string, string>;
}

export function PresenceSidebar({ onlineUsers, typingUsers }: PresenceSidebarProps) {
  return (
    <div className="w-72 border-l bg-muted/10 h-full flex flex-col">
      <div className="h-14 px-4 border-b flex items-center bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 sticky top-0 z-10">
        <h3 className="font-semibold flex items-center text-sm text-foreground">
          <Users2Icon className="w-4 h-4 mr-2 text-muted-foreground" />
          Members <span className="ml-2 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">{onlineUsers.length}</span>
        </h3>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-3 px-2">
              Online
            </h4>
            {onlineUsers.length === 0 && (
              <p className="text-sm text-muted-foreground/60 px-2 italic">Nobody's around...</p>
            )}
            <div className="space-y-0.5">
              {onlineUsers.map((user) => {
                const isTyping = !!typingUsers[user.user_id];
                const initials = user.display_name?.substring(0, 2).toUpperCase() || "U";
                
                return (
                  <div 
                    key={user.user_id} 
                    className="flex items-center px-2 py-2 hover:bg-muted/40 rounded-xl transition-all group cursor-default"
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-9 w-9 border border-border/50">
                        <AvatarImage src={user.avatar_url || ""} />
                        <AvatarFallback className="text-[11px] font-medium bg-background text-muted-foreground">{initials}</AvatarFallback>
                      </Avatar>
                      {/* Polished Online Indicator */}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full shadow-sm"></span>
                    </div>
                    
                    <div className="ml-3 overflow-hidden flex-1">
                      <p className="text-[14px] font-medium truncate text-foreground/90 group-hover:text-foreground transition-colors">
                        {user.display_name}
                      </p>
                      {isTyping ? (
                        <p className="text-[11px] font-medium text-primary animate-pulse truncate flex items-center">
                          typing...
                        </p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground/60 truncate">
                          Online
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}