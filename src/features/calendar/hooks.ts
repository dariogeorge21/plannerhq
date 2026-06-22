import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { createCalendarService } from "./services";
import { createEventAction, updateEventAction, deleteEventAction } from "./actions";
import { CalendarEventWithDetails, CalendarTask, WorkspaceMemberOption } from "./types";
import { useEffect } from "react";

export function useCalendarRealtime(workspaceId: string | undefined, dateRange: { start: string, end: string } | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;

    const supabase = createClient();
    
    // Listen to events
    const channel = supabase
      .channel(`workspace-${workspaceId}-calendar`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calendar_events",
          filter: `workspace_id=eq.${workspaceId}`,
        },
        () => {
          if (dateRange) {
             queryClient.invalidateQueries({ queryKey: ["calendar_events", workspaceId] });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_attendees",
        },
        () => {
          if (dateRange) {
             queryClient.invalidateQueries({ queryKey: ["calendar_events", workspaceId] });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_mentions",
        },
        () => {
          if (dateRange) {
             queryClient.invalidateQueries({ queryKey: ["calendar_events", workspaceId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, queryClient, dateRange]);
}

export function useCalendarEvents(workspaceId: string | undefined, dateRange: { start: string, end: string } | null) {
  useCalendarRealtime(workspaceId, dateRange);

  return useQuery({
    queryKey: ["calendar_events", workspaceId, dateRange?.start, dateRange?.end],
    queryFn: async () => {
      if (!workspaceId || !dateRange) return [];
      const supabase = createClient();
      const service = createCalendarService(supabase);
      return service.getEventsForRange(workspaceId, dateRange.start, dateRange.end);
    },
    enabled: !!workspaceId && !!dateRange,
  });
}

export function useCalendarTasks(workspaceId: string | undefined, dateRange: { start: string, end: string } | null) {
  return useQuery({
    queryKey: ["calendar_tasks", workspaceId, dateRange?.start, dateRange?.end],
    queryFn: async () => {
      if (!workspaceId || !dateRange) return [];
      const supabase = createClient();
      const service = createCalendarService(supabase);
      return service.getTasksWithDueDates(workspaceId, dateRange.start, dateRange.end);
    },
    enabled: !!workspaceId && !!dateRange,
  });
}

export function useWorkspaceMembersForCalendar(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["workspace_members", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const supabase = createClient();
      const service = createCalendarService(supabase);
      return service.getWorkspaceMembers(workspaceId);
    },
    enabled: !!workspaceId,
  });
}

export function useCreateEvent(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createEventAction({ ...data, workspace_id: workspaceId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["calendar_events", workspaceId] }),
  });
}

export function useUpdateEvent(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateEventAction({ ...data, workspace_id: workspaceId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["calendar_events", workspaceId] }),
  });
}

export function useDeleteEvent(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => deleteEventAction(eventId, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["calendar_events", workspaceId] }),
  });
}
