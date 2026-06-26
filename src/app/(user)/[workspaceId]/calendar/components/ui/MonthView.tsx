"use client";

import { format, isSameDay, isSameMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { CalendarEventWithDetails, CalendarTask } from "@/features/calendar/types"
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEventWithDetails[];
  tasks: CalendarTask[];
  onEventClick: (event: CalendarEventWithDetails) => void;
  onTaskClick: (task: CalendarTask) => void;
  onDayClick: (date: Date) => void;
}

export function MonthView({
  currentDate,
  events,
  tasks,
  onEventClick,
  onTaskClick,
  onDayClick
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full w-full bg-card text-card-foreground rounded-b-xl overflow-hidden border-x border-b border-border shadow-sm">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-3 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-auto">
        {days.map((day, i) => {
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, monthStart);

          // Get items for this day
          const dayEvents = events.filter(e => isSameDay(new Date(e.start_at), day));
          const dayTasks = tasks.filter(t => isSameDay(new Date(t.due_date), day));

          // Combine and sort (events first, then tasks)
          const allItems = [
            ...dayEvents.map(e => ({ item: e, type: 'event' as const })),
            ...dayTasks.map(t => ({ item: t, type: 'task' as const }))
          ];

          return (
            <div
              key={day.toString()}
              onClick={() => onDayClick(day)}
              className={cn(
                "min-h-[120px] p-1.5 border-r border-b border-border relative group cursor-pointer transition-colors hover:bg-accent/50",
                !isCurrentMonth && "bg-muted/10",
                (i + 1) % 7 === 0 && "border-r-0" // Remove right border for last column
              )}
            >
              <div className="flex justify-between items-start mb-1 px-1">
                <span
                  className={cn(
                    "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full",
                    !isCurrentMonth ? "text-muted-foreground/50" : "text-foreground",
                    isToday && "bg-primary text-primary-foreground shadow-sm"
                  )}
                >
                  {format(day, dateFormat)}
                </span>
              </div>

              <div className="space-y-1 mt-1 flex flex-col max-h-[calc(100%-32px)] overflow-y-auto scrollbar-none pb-1 px-0.5">
                {allItems.slice(0, 4).map(({ item, type }) => (
                  <EventCard
                    key={item.id}
                    item={item}
                    type={type}
                    view="month"
                    onClick={() => type === 'event' ? onEventClick(item as CalendarEventWithDetails) : onTaskClick(item as CalendarTask)}
                  />
                ))}
                {allItems.length > 4 && (
                  <div className="text-[10px] font-semibold text-muted-foreground pl-1">
                    +{allItems.length - 4} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
