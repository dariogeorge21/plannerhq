"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { GetWorkspaceMembers } from "@/features/workspace/workspace";
import { Users, MessageSquareIcon, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function MembersWidgetSkeleton() {
  return (
    <Card className="h-full flex flex-col relative overflow-hidden border-neutral-200/60 dark:border-neutral-800 shadow-sm animate-pulse">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-32 h-6 rounded-md" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col space-y-4 pt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full hidden sm:block" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function MembersWidget({ workspaceId }: { workspaceId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useSession();

  const { data: membersRes, isLoading } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => GetWorkspaceMembers(workspaceId)
  });

  if (isLoading) {
    return <MembersWidgetSkeleton />;
  }

  const members = membersRes?.data || [];
  const displayedMembers = isExpanded ? members : members.slice(0, 5);
  const hasMore = members.length > 5;

  return (
    <Card className="h-full flex flex-col relative overflow-hidden border-neutral-200/60 dark:border-neutral-800 shadow-sm">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-indigo-500" />
          Workspace Members
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative flex flex-col">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
          {displayedMembers.map((m: any) => (
            <div key={m.hqid} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-neutral-200 dark:border-neutral-700">
                  <AvatarImage src={m.avatar_url} />
                  <AvatarFallback className="font-bold text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {m.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-bold leading-none mb-1">{m.display_name}</div>
                  <div className="text-sm font-bold text-muted-foreground">{m.profile_role ? `${m.profile_role} • ` : ""}{m.role == "owner" ? "Owner" : m.role == "admin" ? "Admin" : "Workspace Member"}</div>
                  <div className="text-xs text-muted-foreground font-medium">{m.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {user?.hqid === m.hqid ? (
                  <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-bold border-indigo-200 dark:border-indigo-800">
                    YOU
                  </Badge>
                ) : (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400" asChild onClick={(e) => e.stopPropagation()}>
                      <Link href={`/${workspaceId}/chat/`}>
                        <MessageSquareIcon className="w-4 h-4" />
                      </Link>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden sm:flex h-8 text-xs font-semibold rounded-full border-neutral-200 dark:border-neutral-700">Profile</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-center text-xl font-black">Member Profile</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center p-6 space-y-5">
                          <Avatar className="w-28 h-28 border-4 border-indigo-50 dark:border-indigo-950 shadow-xl">
                            <AvatarImage src={m.avatar_url} />
                            <AvatarFallback className="text-4xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                              {m.display_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-center space-y-1">
                            <h3 className="text-2xl font-black text-foreground">{m.display_name}</h3>
                            <p className="font-bold">{m.profile_role ? `${m.profile_role} • ` : ""}{m.role == "owner" ? "Owner" : m.role == "admin" ? "Admin" : "Workspace Member"}</p>
                            <p className="text-sm font-medium text-muted-foreground">{m.email}</p>
                            <p className="text-xs font-mono text-muted-foreground/70 bg-muted/50 px-2 py-1 rounded-md mt-2 inline-block">HQID: {m.hqid}</p>
                          </div>
                          <Badge variant="secondary" className={`uppercase tracking-widest px-4 py-1 text-xs font-bold rounded-full ${m.role === 'owner' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                            {m.role}
                          </Badge>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {!isExpanded && hasMore && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
        {members.length <= 3 && (
          <div className="p-4 mt-auto border-t border-neutral-100 dark:border-neutral-800/50">
            <Button variant="outline" className="w-full border-dashed border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" asChild>
              <Link href={`/${workspaceId}/members`}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite More Members
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
      {!isExpanded && hasMore && (
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800/50 bg-background/80 backdrop-blur-sm z-10 flex justify-center mt-auto">
          <Button variant="ghost" className="w-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl font-bold" onClick={() => setIsExpanded(true)}>View More Members</Button>
        </div>
      )}
    </Card>
  );
}
