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
}

export function ChannelSidebar({
  channels,
  activeChannelId,
  setActiveChannelId,
  workspaceMembers,
  startDirectChat,
  currentUserId,
}: ChannelSidebarProps) {
  const publicChannels = channels.filter(c => !c.is_direct);
  const directChannels = channels.filter(c => c.is_direct);
  const otherMembers = workspaceMembers.filter(m => m.user_id !== currentUserId);

  return (
    <div className="h-full flex flex-col">
      <div className="h-16 px-5 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm">
        <h3 className="font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
          <MessageSquareText className="w-4 h-4 text-neutral-400" />
          Chats
        </h3>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <div className="px-5 space-y-8">
          
          {/* Chat Rooms Section */}
          <div>
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              Chat Rooms
            </h4>
            <div className="space-y-1">
              {publicChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={cn(
                    "w-full flex items-center group p-2 -mx-2 rounded-xl border border-transparent transition-all text-left",
                    activeChannelId === channel.id
                      ? "bg-indigo-50 border-indigo-100 text-indigo-900 shadow-sm"
                      : "hover:bg-white hover:border-neutral-200/60 hover:shadow-sm text-neutral-600"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0 transition-colors",
                    activeChannelId === channel.id
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200 group-hover:text-neutral-600"
                  )}>
                    <HashIcon className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold truncate flex-1">
                    {channel.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Chats Section */}
          <div>
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              Personal chats
            </h4>
            <div className="space-y-1">
              {otherMembers.length === 0 ? (
                <p className="text-sm text-neutral-500 italic">No other members</p>
              ) : (
                otherMembers.map((member) => {
                  const initials = member.display_name?.substring(0, 2).toUpperCase() || '??';
                  // Check if we already have an active direct channel with this member
                  const existingDirectChannel = directChannels.find(c => c.name === 'Direct Message' && activeChannelId === c.id);
                  // For UI highlight we can just guess or we just trigger the startDirectChat which sets active
                  // Wait, how do we know if it's currently active? 
                  // If we don't map it perfectly, clicking it will just load it.

                  return (
                    <button
                      key={member.user_id}
                      onClick={() => startDirectChat(member.user_id)}
                      className={cn(
                        "w-full flex items-center group p-2 -mx-2 rounded-xl border border-transparent transition-all text-left",
                        "hover:bg-white hover:border-neutral-200/60 hover:shadow-sm text-neutral-600"
                      )}
                    >
                      <div className="relative flex-shrink-0 mr-3">
                        {member.avatar_url ? (
                          <img 
                            src={member.avatar_url} 
                            alt={member.display_name} 
                            className="h-8 w-8 rounded-full border border-neutral-200 object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-[10px] text-neutral-700">
                            {initials}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate text-neutral-900 leading-tight">
                          {member.display_name}
                        </p>
                        <p className="text-[11px] font-medium text-neutral-400 truncate mt-0.5">
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
