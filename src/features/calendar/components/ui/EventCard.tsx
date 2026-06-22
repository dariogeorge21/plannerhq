"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarItemType, CalendarEventWithDetails, CalendarTask } from "../../types";
import { Clock, Link as LinkIcon, CheckCircle2 } from "lucide-react";

interface EventCardProps {
  item: CalendarEventWithDetails | CalendarTask;
  type: CalendarItemType;
  view: 'month' | 'week' | 'day';
  onClick: () => void;
  isAllDay?: boolean;
}

export function EventCard({ item, type, view, onClick, isAllDay = false }: EventCardProps) {
  const isTask = type === 'task';
  const taskItem = item as CalendarTask;
  const eventItem = item as CalendarEventWithDetails;

  // Determine styles based on type and priority
  let bgClass = "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700";
  let solidBgClass = "bg-indigo-500";
  
  if (isTask) {
    if (taskItem.completed) {
      bgClass = "bg-neutral-100 border-neutral-200 hover:bg-neutral-200 text-neutral-500 opacity-70";
      solidBgClass = "bg-neutral-400";
    } else {
      bgClass = "bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-700";
      solidBgClass = "bg-teal-500";
    }
  } else {
    if (eventItem.priority === 'high') {
      bgClass = "bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700";
      solidBgClass = "bg-rose-500";
    } else if (eventItem.priority === 'low') {
      bgClass = "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-700";
      solidBgClass = "bg-emerald-500";
    }
  }

  // Month view: compact pill
  if (view === 'month') {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={cn(
          "text-xs px-1.5 py-0.5 rounded-sm truncate cursor-pointer transition-colors border shadow-sm flex items-center gap-1",
          bgClass
        )}
        title={item.title}
      >
        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", solidBgClass)} />
        <span className="truncate font-medium flex-1">{item.title}</span>
        {isTask && <LinkIcon className="w-3 h-3 shrink-0 opacity-50" />}
      </div>
    );
  }

  // Week/Day view: absolute positioned block (positioning handled by parent, this just renders content)
  const startTime = isTask ? new Date(taskItem.due_date) : new Date(eventItem.start_at);
  const endTime = isTask ? new Date(taskItem.due_date) : new Date(eventItem.end_at); // For tasks, end = start for layout purposes
  
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        "h-full w-full rounded-md border shadow-sm p-1.5 flex flex-col cursor-pointer transition-colors overflow-hidden",
        bgClass,
        isTask && taskItem.completed && "opacity-60 grayscale-[50%]"
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-xs font-semibold leading-tight truncate">{item.title}</span>
        {isTask && (
          taskItem.completed ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <LinkIcon className="w-3.5 h-3.5 shrink-0 opacity-60" />
        )}
      </div>
      
      {!isTask && !isAllDay && (
        <div className="flex items-center text-[10px] mt-1 opacity-80">
          <Clock className="w-3 h-3 mr-1" />
          {format(startTime, "h:mm")} - {format(endTime, "h:mm")}
        </div>
      )}
      {isTask && !isAllDay && (
        <div className="flex items-center text-[10px] mt-1 opacity-80">
          <Clock className="w-3 h-3 mr-1" />
          {format(startTime, "h:mm a")} Due
        </div>
      )}
    </div>
  );
}
