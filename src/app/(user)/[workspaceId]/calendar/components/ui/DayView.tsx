"use client";

import { format, isSameDay, eachHourOfInterval, startOfDay, endOfDay } from "date-fns";
import { CalendarEventWithDetails, CalendarTask } from "@/features/calendar/types"
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEventWithDetails[];
  tasks: CalendarTask[];
  onEventClick: (event: CalendarEventWithDetails) => void;
  onTaskClick: (task: CalendarTask) => void;
  onDayClick: (date: Date, hour?: number) => void;
}

export function DayView({
  currentDate,
  events,
  tasks,
  onEventClick,
  onTaskClick,
  onDayClick
}: DayViewProps) {
  const hours = eachHourOfInterval({ start: startOfDay(currentDate), end: endOfDay(currentDate) });

  const getPositionStyle = (start: Date, end: Date) => {
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const duration = Math.max(0.5, endHour - startHour);
    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
    };
  };

  const dayEvents = events.filter(e => isSameDay(new Date(e.start_at), currentDate));
  const dayTasks = tasks.filter(t => isSameDay(new Date(t.due_date), currentDate));

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground rounded-b-xl overflow-hidden border-x border-b border-border shadow-sm">
      {/* Header */}
      <div className="flex border-b border-border bg-muted/30">
        <div className="w-16 shrink-0 border-r border-border" />
        <div className="flex-1 flex flex-col items-center py-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{format(currentDate, "EEEE")}</span>
          <span className={cn(
            "text-lg font-semibold w-8 h-8 flex items-center justify-center rounded-full mt-0.5",
            isSameDay(currentDate, new Date()) ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground"
          )}>
            {format(currentDate, "d")}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto relative bg-background">
        <div className="flex relative" style={{ height: `${24 * 60}px` }}>
          {/* Time axis */}
          <div className="w-16 shrink-0 border-r border-border bg-card z-10">
            {hours.map((hour, i) => (
              <div key={i} className="h-[60px] relative">
                {i > 0 && (
                  <span className="absolute -top-2.5 right-2 text-[10px] font-medium text-muted-foreground">
                    {format(hour, "ha")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day Column */}
          <div
            className="flex-1 relative cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const y = e.clientY - rect.top;
              const hour = Math.floor(y / 60);
              onDayClick(currentDate, hour);
            }}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {hours.map((_, i) => (
                <div key={i} className="h-[60px] border-t border-border w-full" />
              ))}
            </div>

            {/* Events */}
            {dayEvents.map(event => {
              const start = new Date(event.start_at);
              const end = new Date(event.end_at);
              return (
                <div
                  key={event.id}
                  className="absolute w-[calc(100%-16px)] left-[8px] z-20"
                  style={getPositionStyle(start, end)}
                >
                  <EventCard item={event} type="event" view="day" onClick={() => onEventClick(event)} />
                </div>
              );
            })}

            {/* Tasks */}
            {dayTasks.map(task => {
              const due = new Date(task.due_date);
              const end = new Date(due.getTime() + 30 * 60000);
              return (
                <div
                  key={task.id}
                  className="absolute w-[calc(100%-16px)] left-[8px] z-20"
                  style={getPositionStyle(due, end)}
                >
                  <EventCard item={task} type="task" view="day" onClick={() => onTaskClick(task)} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
