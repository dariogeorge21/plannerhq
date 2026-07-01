import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AwarenessState } from "@/features/collaboration/types";
import { useSession } from "@/features/auth/providers/SessionProvider";

export default function PresenceAvatars({ users }: { users: AwarenessState[] }) {
  const { user } = useSession();

  if (!users || users.length === 0) return null;

  return (
    <div className="flex items-center space-x-[-10px]">
      <TooltipProvider delayDuration={100}>
        {users.slice(0, 5).map((u, index) => {
          const isCurrentUser = user && u.user.id === user.id;
          return (
            <Tooltip key={u.clientId}>
              <TooltipTrigger asChild>
                <div className="relative inline-block transition-transform duration-200 hover:-translate-y-1 hover:z-20 hover:scale-110" style={{ zIndex: 10 - index }}>
                  <Avatar
                    className="w-9 h-9 border-[3px] border-background shadow-sm ring-2 ring-transparent transition-all"
                    style={{ '--tw-ring-color': u.user.color } as any}
                  >
                    <AvatarImage src={u.user.avatar} />
                    <AvatarFallback className="font-medium text-xs" style={{ backgroundColor: u.user.color, color: "#fff" }}>
                      {u.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Typing indicator mock */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background shadow-sm animate-pulse" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground font-medium text-xs rounded-md shadow-xl border border-border">
                <p>
                  {u.user.name}
                  {isCurrentUser && <span className="text-muted-foreground ml-1">(YOU)</span>}
                </p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
      {users.length > 5 && (
        <div className="w-9 h-9 rounded-full border-[3px] border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shadow-sm z-0 relative ml-[-10px]">
          +{users.length - 5}
        </div>
      )}
    </div>
  );
}
