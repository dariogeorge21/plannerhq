import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AwarenessState } from "@/features/collaboration/types";

export default function PresenceAvatars({ users }: { users: AwarenessState[] }) {
  if (!users || users.length === 0) return null;

  return (
    <div className="flex items-center space-x-[-10px]">
      <TooltipProvider delayDuration={100}>
        {users.slice(0, 5).map((u, index) => (
          <Tooltip key={u.clientId}>
            <TooltipTrigger asChild>
              <div className="relative inline-block transition-transform duration-200 hover:-translate-y-1 hover:z-20 hover:scale-110" style={{ zIndex: 10 - index }}>
                <Avatar
                  className="w-9 h-9 border-[3px] border-white shadow-sm ring-2 ring-transparent transition-all"
                  style={{ '--tw-ring-color': u.user.color } as any}
                >
                  <AvatarImage src={u.user.avatar} />
                  <AvatarFallback className="font-medium text-xs" style={{ backgroundColor: u.user.color, color: "#fff" }}>
                    {u.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-900 text-white font-medium text-xs rounded-md shadow-xl border-none">
              <p>{u.user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
      {users.length > 5 && (
        <div className="w-9 h-9 rounded-full border-[3px] border-white bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-600 shadow-sm z-0">
          +{users.length - 5}
        </div>
      )}
    </div>
  );
}
