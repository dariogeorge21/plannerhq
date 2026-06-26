"use client";

import React, { useState, useMemo } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { useRouter } from "next/navigation";
import { CalendarToolbar } from "../CalendarToolbar";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { CreateEventModal } from "../modals/CreateEventModal";
import { EditEventModal } from "../modals/EditEventModal";
import { EventDetailModal } from "../modals/EventDetailModal";
import { useCalendarEvents, useCalendarTasks, useWorkspaceMembersForCalendar } from "@/features/calendar/hooks";
import { CalendarEventWithDetails, CalendarTask } from "@/features/calendar/types";

interface CalendarViewProps {
  workspaceId: string;
}

export function CalendarView({ workspaceId }: CalendarViewProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<'month' | 'week' | 'day'>('month');

  // Compute date range for fetching
  const dateRange = useMemo(() => {
    if (activeView === 'month') {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      return { start: start.toISOString(), end: end.toISOString() };
    } else if (activeView === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return { start: start.toISOString(), end: end.toISOString() };
    } else {
      const start = new Date(currentDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(currentDate);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }
  }, [currentDate, activeView]);

  // Fetch data
  const { data: events = [] } = useCalendarEvents(workspaceId, dateRange);
  const { data: tasks = [] } = useCalendarTasks(workspaceId, dateRange);
  const { data: members = [] } = useWorkspaceMembersForCalendar(workspaceId);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDate, setCreateDate] = useState<Date | undefined>(undefined);
  
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventWithDetails | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Handlers
  const handleDayClick = (date: Date, hour?: number) => {
    const defaultDate = new Date(date);
    if (hour !== undefined) {
      defaultDate.setHours(hour, 0, 0, 0);
    } else {
      // Default to 9 AM if just clicked the day
      defaultDate.setHours(9, 0, 0, 0);
    }
    setCreateDate(defaultDate);
    setIsCreateOpen(true);
  };

  const handleEventClick = (event: CalendarEventWithDetails) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleTaskClick = (task: CalendarTask) => {
    router.push(`/${workspaceId}/tasks?taskId=${task.id}`);
  };

  return (
    <div className="flex flex-col h-full bg-muted/30 p-4 md:p-6 lg:p-8">
      <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border flex flex-col h-full">
        <CalendarToolbar
          currentDate={currentDate}
          activeView={activeView}
          onViewChange={setActiveView}
          onDateChange={setCurrentDate}
          onCreateClick={() => {
            const defaultDate = new Date(currentDate);
            defaultDate.setHours(9, 0, 0, 0);
            setCreateDate(defaultDate);
            setIsCreateOpen(true);
          }}
        />

        <div className="flex-1 min-h-0 relative">
          {activeView === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              tasks={tasks}
              onEventClick={handleEventClick}
              onTaskClick={handleTaskClick}
              onDayClick={handleDayClick}
            />
          )}
          {activeView === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              tasks={tasks}
              onEventClick={handleEventClick}
              onTaskClick={handleTaskClick}
              onDayClick={handleDayClick}
            />
          )}
          {activeView === 'day' && (
            <DayView
              currentDate={currentDate}
              events={events}
              tasks={tasks}
              onEventClick={handleEventClick}
              onTaskClick={handleTaskClick}
              onDayClick={handleDayClick}
            />
          )}
        </div>
      </div>

      <CreateEventModal
        workspaceId={workspaceId}
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setCreateDate(undefined);
        }}
        defaultDate={createDate}
        members={members}
      />

      {selectedEvent && (
        <EventDetailModal
          workspaceId={workspaceId}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          event={selectedEvent}
          members={members}
          onEditClick={() => {
            setIsDetailOpen(false);
            setIsEditOpen(true);
          }}
          canEdit={true} // All members can edit
        />
      )}

      {selectedEvent && (
        <EditEventModal
          workspaceId={workspaceId}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          event={selectedEvent}
          members={members}
        />
      )}
    </div>
  );
}
