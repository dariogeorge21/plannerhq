// src/features/chat/components/PresenceSidebar.tsx
import React from "react";
import { ChatPresenceState } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users2, CircleDot } from "lucide-react";

interface PresenceSidebarProps {
  onlineUsers: ChatPresenceState[];
  typingUsers: Record<string, string>;
}

export function PresenceSidebar({ onlineUsers, typingUsers }: PresenceSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="h-16 px-5 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm">
        <h3 className="font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
          <Users2 className="w-4 h-4 text-neutral-400" />
          Workspace
        </h3>
        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
          {onlineUsers.length} Online
        </span>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <div className="px-5 space-y-6">
          <div>
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CircleDot className="w-3 h-3 text-emerald-500" /> Active Now
            </h4>
            
            {onlineUsers.length === 0 ? (
              <p className="text-sm text-neutral-500 italic">No one is online</p>
            ) : (
              <div className="space-y-1">
                {onlineUsers.map((user) => {
                  const isTyping = Object.keys(typingUsers).includes(user.user_id);
                  const initials = user.display_name.substring(0, 2).toUpperCase();

                  return (
                    <div 
                      key={user.user_id} 
                      className="flex items-center group p-2 -mx-2 rounded-xl hover:bg-white border border-transparent hover:border-neutral-200/60 hover:shadow-sm transition-all"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="h-9 w-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-700">
                          {initials}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                      </div>
                      
                      <div className="ml-3 overflow-hidden flex-1">
                        <p className="text-sm font-bold truncate text-neutral-900">
                          {user.display_name}
                        </p>
                        {isTyping ? (
                          <p className="text-[11px] font-semibold text-indigo-500 animate-pulse truncate">
                            typing...
                          </p>
                        ) : (
                          <p className="text-[11px] font-medium text-neutral-400 truncate">
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