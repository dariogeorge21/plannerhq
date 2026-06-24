import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { createPersonalCalendarService } from './services';
import {
  createPersonalEventAction,
  updatePersonalEventAction,
  deletePersonalEventAction,
} from './actions';
import {
  AggregatedCalendarItem,
  PersonalEvent,
  WorkspaceInfo,
} from './types';

// ─── Workspace list ──────────────────────────────────────────────────────────

export function useUserWorkspaces(userId: string | undefined) {
  return useQuery({
    queryKey: ['personal_calendar_workspaces', userId],
    queryFn: async (): Promise<WorkspaceInfo[]> => {
      if (!userId) return [];
      const supabase = createClient();
      const service = createPersonalCalendarService(supabase);
      return service.getUserWorkspaces(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes — workspaces rarely change
  });
}

// ─── Aggregated calendar data ────────────────────────────────────────────────

export function usePersonalCalendarData(
  userId: string | undefined,
  workspaces: WorkspaceInfo[],
  dateRange: { start: string; end: string } | null
) {
  return useQuery({
    queryKey: [
      'personal_calendar_data',
      userId,
      workspaces.map((w) => w.id).join(','),
      dateRange?.start,
      dateRange?.end,
    ],
    queryFn: async (): Promise<AggregatedCalendarItem[]> => {
      if (!userId || !dateRange) return [];
      const supabase = createClient();
      const service = createPersonalCalendarService(supabase);

      const [personalEvents, wsEvents, wsTasks] = await Promise.all([
        service.getPersonalEventsForRange(userId, dateRange.start, dateRange.end),
        service.getWorkspaceEventsForRange(workspaces, dateRange.start, dateRange.end),
        service.getWorkspaceTasksForRange(workspaces, dateRange.start, dateRange.end),
      ]);

      const items: AggregatedCalendarItem[] = [
        ...personalEvents.map((item): AggregatedCalendarItem => ({
          type: 'personal_event',
          item,
        })),
        ...wsEvents.map((item): AggregatedCalendarItem => ({
          type: 'workspace_event',
          item,
        })),
        ...wsTasks.map((item): AggregatedCalendarItem => ({
          type: 'workspace_task',
          item,
        })),
      ];

      return items;
    },
    enabled: !!userId && !!dateRange,
  });
}

// ─── Personal event mutations ────────────────────────────────────────────────

export function useCreatePersonalEvent(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string | null;
      start_at: string;
      end_at: string;
      color: string;
    }) => createPersonalEventAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal_calendar_data', userId] });
    },
  });
}

export function useUpdatePersonalEvent(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      title?: string;
      description?: string | null;
      start_at?: string;
      end_at?: string;
      color?: string;
    }) => updatePersonalEventAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal_calendar_data', userId] });
    },
  });
}

export function useDeletePersonalEvent(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => deletePersonalEventAction(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal_calendar_data', userId] });
    },
  });
}
