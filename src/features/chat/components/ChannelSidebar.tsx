import React from "react";
import { Channel } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HashIcon, Users, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelSidebarProps {
  channels: Channel[];
  activeChannelId: string | null;
  setActiveChannelId: (id: string) => void;
  workspaceMembers: any[];
  startDirectChat: (memberId: string) => void;
  currentUserId: string | null;
  loading?: boolean;
}

export function ChannelSidebar({
  channels,
  activeChannelId,
  setActiveChannelId,
  workspaceMembers,
  startDirectChat,
  currentUserId,
  loading = false,
}: ChannelSidebarProps) {
  const publicChannels = channels.filter(c => !c.is_direct);
  const directChannels = channels.filter(c => c.is_direct);
  const otherMembers = workspaceMembers.filter(m => m.user_id !== currentUserId);

  return (
    <div className="h-full flex flex-col bg-muted/10 transition-colors duration-300">
      <div className="h-16 px-5 border-b border-border flex items-center justify-between shrink-0 bg-background/50 backdrop-blur-sm transition-colors duration-300">
        <h3 className="font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <MessageSquareText className="w-4 h-4 text-muted-foreground" />
          Chats
        </h3>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <div className="px-5 space-y-8">
          
          {/* Chat Rooms Section */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              Chat Rooms
            </h4>
            <div className="space-y-1">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 -mx-2">
                    <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                ))
              ) : (
                publicChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannelId(channel.id)}
                    className={cn(
                      "w-full flex items-center group p-2 -mx-2 rounded-xl border border-transparent transition-all text-left",
                      activeChannelId === channel.id
                        ? "bg-primary/10 border-primary/20 text-primary shadow-sm"
                        : "hover:bg-background hover:border-border/60 hover:shadow-sm text-foreground/80 hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0 transition-colors",
                      activeChannelId === channel.id
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground group-hover:bg-muted/80 group-hover:text-foreground"
                    )}>
                      <HashIcon className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold truncate flex-1">
                      {channel.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Personal Chats Section */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              Personal chats
            </h4>
            <div className="space-y-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 -mx-2">
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="space-y-1 flex-1">
                       <div className="h-3.5 bg-muted animate-pulse rounded w-3/4" />
                       <div className="h-2.5 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : otherMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No other members</p>
              ) : (
                otherMembers.map((member) => {
                  const initials = member.display_name?.substring(0, 2).toUpperCase() || '??';
                  return (
                    <button
                      key={member.user_id}
                      onClick={() => startDirectChat(member.user_id)}
                      className={cn(
                        "w-full flex items-center group p-2 -mx-2 rounded-xl border border-transparent transition-all text-left",
                        "hover:bg-background hover:border-border/60 hover:shadow-sm text-foreground/80 hover:text-foreground"
                      )}
                    >
                      <div className="relative flex-shrink-0 mr-3">
                        {member.avatar_url ? (
                          <img 
                            src={member.avatar_url} 
                            alt={member.display_name} 
                            className="h-8 w-8 rounded-full border border-border object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-[10px] text-foreground/70">
                            {initials}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate text-foreground leading-tight">
                          {member.display_name}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground truncate mt-0.5">
                          @{member.hqid || member.display_name?.toLowerCase().replace(/\s+/g, '')}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
