"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useCalendarEvents } from "@/features/calendar/hooks";
import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function CalendarWidgetSkeleton() {
  return (
    <Card className="h-full flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm animate-pulse">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-40 h-6 rounded-md" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col pt-4">
        <div className="space-y-4 px-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-5">
              <Skeleton className="w-14 h-14 rounded-[1.25rem] shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="p-4 bg-background border-t border-neutral-100 dark:border-neutral-800/50 mt-auto">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </Card>
  );
}

export function CalendarWidget({ workspaceId }: { workspaceId: string }) {
  const { today, nextWeek } = useMemo(() => {
    const t = new Date();
    const nw = new Date(t);
    nw.setDate(t.getDate() + 7);
    return { today: t, nextWeek: nw };
  }, []);
  
  const { data: events, isLoading } = useCalendarEvents(workspaceId, { 
    start: today.toISOString(), 
    end: nextWeek.toISOString() 
  });

  if (isLoading) {
    return <CalendarWidgetSkeleton />;
  }

  return (
    <Card className="h-full flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm">
       <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
             <CalendarDays className="w-5 h-5 text-indigo-500" />
             Upcoming Schedule
          </CardTitle>
       </CardHeader>
       <CardContent className="p-0 flex-1 flex flex-col">
          {events && events.length > 0 ? (
             <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50 flex-1">
               {events.slice(0, 4).map((event: any) => {
                 const start = new Date(event.start_at);
                 return (
                  <Link key={event.id} href={`/${workspaceId}/calendar?eventId=${event.id}`} className="flex items-center p-5 hover:bg-accent/50 transition-colors group">
                     <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center mr-5 border border-indigo-100 dark:border-indigo-900/50 group-hover:bg-indigo-500 group-hover:text-white transition-colors shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest">{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(start)}</span>
                        <span className="text-xl font-black leading-none mt-0.5">{start.getDate()}</span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{event.title}</div>
                        <div className="text-xs font-semibold text-muted-foreground mt-1 flex items-center"><Clock className="w-3 h-3 mr-1 opacity-70"/> {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(start)}</div>
                     </div>
                  </Link>
               )})}
             </div>
          ) : (
             <div className="py-16 flex flex-col items-center justify-center gap-4 px-6 text-center flex-1">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shadow-inner mb-2">
                  <CalendarDays className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
                </div>
                <p className="text-sm text-muted-foreground font-semibold max-w-[200px]">Schedule meetings and Create Events alternatively</p>
             </div>
          )}
       </CardContent>
       <div className="p-4 bg-background border-t border-neutral-100 dark:border-neutral-800/50 mt-auto">
          <Button className="w-full rounded-xl font-bold shadow-sm" variant="outline" asChild>
             <Link href={`/${workspaceId}/calendar`}>Checkout Calendar</Link>
          </Button>
       </div>
    </Card>
  );
}
