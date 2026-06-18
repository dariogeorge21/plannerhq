import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AwarenessState } from "@/features/collaboration/types";

export default function PresenceAvatars({ users }: { users: AwarenessState[] }) {
  if (!users || users.length === 0) return null;

  return (
    <div className="flex items-center space-x-[-12px]">
      <TooltipProvider>
        {users.slice(0, 5).map((u) => (
          <Tooltip key={u.clientId}>
            <TooltipTrigger>
              <Avatar
                className="w-8 h-8 border-2 border-white ring-2 transition-transform hover:z-10"
                style={{ ringColor: u.user.color }}
              >
                <AvatarImage src={u.user.avatar} />
                <AvatarFallback style={{ backgroundColor: u.user.color, color: "#fff" }}>
                  {u.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{u.user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
      {users.length > 5 && (
        <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-xs font-medium z-0">
          +{users.length - 5}
        </div>
      )}
    </div>
  );
}
