"use client";

import React from "react";
import { format, isSameDay, startOfWeek, addDays, eachHourOfInterval, startOfDay, endOfDay } from "date-fns";
import { CalendarItemType, CalendarEventWithDetails, CalendarTask } from "@/features/calendar/types";
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEventWithDetails[];
  tasks: CalendarTask[];
  onEventClick: (event: CalendarEventWithDetails) => void;
  onTaskClick: (task: CalendarTask) => void;
  onDayClick: (date: Date, hour?: number) => void;
}

export function WeekView({
  currentDate,
  events,
  tasks,
  onEventClick,
  onTaskClick,
  onDayClick
}: WeekViewProps) {
  const startDate = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const hours = eachHourOfInterval({ start: startOfDay(currentDate), end: endOfDay(currentDate) });

  const getPositionStyle = (start: Date, end: Date) => {
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const duration = Math.max(0.5, endHour - startHour); // minimum 30 min height
    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
    };
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground rounded-b-xl overflow-hidden border-x border-b border-border shadow-sm">
      {/* Header */}
      <div className="flex border-b border-border bg-muted/30">
        <div className="w-16 shrink-0 border-r border-border" /> {/* Time column header */}
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map(day => {
            const isToday = isSameDay(day, new Date());
            return (
              <div 
                key={day.toString()} 
                className="flex flex-col items-center py-3 border-r border-border last:border-r-0 cursor-pointer hover:bg-accent/50"
                onClick={() => onDayClick(day)}
              >
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{format(day, "EEE")}</span>
                <span className={cn(
                  "text-lg font-semibold w-8 h-8 flex items-center justify-center rounded-full mt-0.5",
                  isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground"
                )}>
                  {format(day, "d")}
                </span>
              </div>
            );
          })}
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

          {/* Days */}
          <div className="flex-1 grid grid-cols-7 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {hours.map((_, i) => (
                <div key={i} className="h-[60px] border-t border-border w-full" />
              ))}
            </div>

            {/* Columns */}
            {weekDays.map(day => {
              const dayEvents = events.filter(e => isSameDay(new Date(e.start_at), day));
              const dayTasks = tasks.filter(t => isSameDay(new Date(t.due_date), day));
              
              return (
                <div 
                  key={day.toString()} 
                  className="relative border-r border-border last:border-r-0 h-full"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const hour = Math.floor(y / 60);
                    onDayClick(day, hour);
                  }}
                >
                  {/* Events */}
                  {dayEvents.map(event => {
                    const start = new Date(event.start_at);
                    const end = new Date(event.end_at);
                    return (
                      <div
                        key={event.id}
                        className="absolute w-[calc(100%-8px)] left-[4px] z-20"
                        style={getPositionStyle(start, end)}
                      >
                        <EventCard item={event} type="event" view="week" onClick={() => onEventClick(event)} />
                      </div>
                    );
                  })}
                  
                  {/* Tasks */}
                  {dayTasks.map(task => {
                    const due = new Date(task.due_date);
                    // tasks just get a 30min block
                    const end = new Date(due.getTime() + 30 * 60000);
                    return (
                      <div
                        key={task.id}
                        className="absolute w-[calc(100%-8px)] left-[4px] z-20"
                        style={getPositionStyle(due, end)}
                      >
                        <EventCard item={task} type="task" view="week" onClick={() => onTaskClick(task)} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
