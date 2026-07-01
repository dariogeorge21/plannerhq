"use client";

import React from "react";
import Link from "next/link";
import { useTasks } from "@/features/task/hooks";
import { SquareKanban, CheckCircle2, CircleDashed, Clock, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function TasksWidgetSkeleton() {
  return (
    <Card className="h-full relative overflow-hidden flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm animate-pulse">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-32 h-6 rounded-md" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col space-y-2 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="p-4 bg-background border-t border-neutral-100 dark:border-neutral-800/50 mt-auto">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </Card>
  );
}

export function TasksWidget({ workspaceId }: { workspaceId: string }) {
  const { data: tasks, isLoading } = useTasks(workspaceId);

  if (isLoading) {
    return <TasksWidgetSkeleton />;
  }

  return (
    <Card className="h-full relative overflow-hidden flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm">
       <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
             <SquareKanban className="w-5 h-5 text-indigo-500" />
             Active Tasks
          </CardTitle>
       </CardHeader>
       <CardContent className="p-0 flex-1">
          {tasks && tasks.length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
               {tasks.slice(0, 4).map((task: any) => (
                  <Link href={`/${workspaceId}/tasks`} key={task.id} className="p-4 hover:bg-accent/50 transition-colors flex items-center justify-between group cursor-pointer block">
                     <div className="flex items-center gap-3">
                        {task.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <CircleDashed className="w-5 h-5 text-neutral-300 dark:text-neutral-600 group-hover:text-indigo-400 transition-colors" />}
                        <div>
                           <div className="text-sm font-bold leading-none mb-1">{task.title}</div>
                           {task.due_date && <div className="text-xs font-medium text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(task.due_date))}</div>}
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
          ) : (
             <div className="py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shadow-inner">
                   <Inbox className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
                </div>
                <p className="text-muted-foreground font-semibold">No tasks, Create Now</p>
             </div>
          )}
       </CardContent>
       <div className="p-4 bg-background border-t border-neutral-100 dark:border-neutral-800/50 mt-auto">
          <Button className="w-full shadow-sm rounded-xl font-bold" variant={tasks?.length ? "outline" : "default"} asChild>
             <Link href={`/${workspaceId}/tasks`}>{tasks?.length ? "View Tasks in the workspace" : "Create Task"}</Link>
          </Button>
       </div>
    </Card>
  );
}
