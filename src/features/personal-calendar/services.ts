import { SupabaseClient } from '@supabase/supabase-js';
import {
  PersonalEvent,
  AggregatedWorkspaceEvent,
  AggregatedWorkspaceTask,
  WorkspaceInfo,
} from './types';

// Deterministic color for a workspace based on its index in the list
const WORKSPACE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#f59e0b', '#10b981', '#06b6d4',
  '#3b82f6', '#84cc16',
];

export function getWorkspaceColor(index: number): string {
  return WORKSPACE_COLORS[index % WORKSPACE_COLORS.length];
}

export const createPersonalCalendarService = (supabase: SupabaseClient) => ({
  // ─── Personal events ─────────────────────────────────────────────────────

  async getPersonalEventsForRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<PersonalEvent[]> {
    const { data, error } = await supabase
      .from('personal_calendar_events')
      .select('*')
      .eq('user_id', userId)
      .gte('end_at', startDate)
      .lte('start_at', endDate)
      .order('start_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async createPersonalEvent(
    userId: string,
    title: string,
    description: string | null,
    startAt: string,
    endAt: string,
    color: string
  ): Promise<PersonalEvent> {
    const { data, error } = await supabase
      .from('personal_calendar_events')
      .insert({ user_id: userId, title, description, start_at: startAt, end_at: endAt, color })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updatePersonalEvent(
    eventId: string,
    updates: Partial<Omit<PersonalEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<PersonalEvent> {
    const { data, error } = await supabase
      .from('personal_calendar_events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deletePersonalEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('personal_calendar_events')
      .delete()
      .eq('id', eventId);

    if (error) throw new Error(error.message);
  },

  // ─── User workspaces ─────────────────────────────────────────────────────

  async getUserWorkspaces(userId: string): Promise<WorkspaceInfo[]> {
    const { data, error } = await supabase
      .from('workspace_members')
      .select('workspaces!inner(id, name, avatar_url, is_deleted)')
      .eq('user_id', userId)
      .filter('workspaces.is_deleted', 'eq', false);

    if (error) throw new Error(error.message);

    type RawRow = { workspaces: { id: string; name: string; avatar_url: string | null; is_deleted: boolean } };
    return ((data as unknown as RawRow[]) || []).map((row, i) => ({
      id: row.workspaces.id,
      name: row.workspaces.name,
      avatar_url: row.workspaces.avatar_url,
      color: getWorkspaceColor(i),
    }));
  },

  // ─── Aggregated workspace data ───────────────────────────────────────────

  async getWorkspaceEventsForRange(
    workspaces: WorkspaceInfo[],
    startDate: string,
    endDate: string
  ): Promise<AggregatedWorkspaceEvent[]> {
    if (workspaces.length === 0) return [];

    const workspaceIds = workspaces.map((w) => w.id);

    const { data, error } = await supabase
      .from('calendar_events')
      .select('id, workspace_id, title, description, start_at, end_at, priority')
      .in('workspace_id', workspaceIds)
      .gte('end_at', startDate)
      .lte('start_at', endDate)
      .order('start_at', { ascending: true });

    if (error) throw new Error(error.message);

    const wsMap = new Map(workspaces.map((w) => [w.id, w]));

    return (data || []).map((event) => {
      const ws = wsMap.get(event.workspace_id);
      return {
        ...event,
        workspace_name: ws?.name || 'Workspace',
        workspace_color: ws?.color || '#6366f1',
      };
    });
  },

  async getWorkspaceTasksForRange(
    workspaces: WorkspaceInfo[],
    startDate: string,
    endDate: string
  ): Promise<AggregatedWorkspaceTask[]> {
    if (workspaces.length === 0) return [];

    const workspaceIds = workspaces.map((w) => w.id);

    const { data, error } = await supabase
      .from('tasks')
      .select('id, workspace_id, title, description, status, priority, due_date, completed')
      .in('workspace_id', workspaceIds)
      .eq('is_deleted', false)
      .not('due_date', 'is', null)
      .gte('due_date', startDate)
      .lte('due_date', endDate)
      .order('due_date', { ascending: true });

    if (error) throw new Error(error.message);

    const wsMap = new Map(workspaces.map((w) => [w.id, w]));

    return (data || []).map((task) => {
      const ws = wsMap.get(task.workspace_id);
      return {
        ...task,
        workspace_name: ws?.name || 'Workspace',
        workspace_color: ws?.color || '#6366f1',
      };
    });
  },
});
