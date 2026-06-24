// Personal Calendar Types
// Personal events belong to the user only - no workspace association

export interface PersonalEvent {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  color: string;
  created_at: string;
  updated_at: string;
}

// Workspace events surfaced on the personal calendar (read-only)
export interface AggregatedWorkspaceEvent {
  id: string;
  workspace_id: string;
  workspace_name: string;
  workspace_color: string; // derived from workspace avatar / index
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  priority: 'low' | 'medium' | 'high';
}

// Workspace tasks surfaced on the personal calendar (read-only)
export interface AggregatedWorkspaceTask {
  id: string;
  workspace_id: string;
  workspace_name: string;
  workspace_color: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string;
  completed: boolean;
}

export type AggregatedCalendarItemType =
  | 'workspace_event'
  | 'workspace_task'
  | 'personal_event';

export type AggregatedCalendarItem =
  | { type: 'workspace_event'; item: AggregatedWorkspaceEvent }
  | { type: 'workspace_task'; item: AggregatedWorkspaceTask }
  | { type: 'personal_event'; item: PersonalEvent };

// Workspace info for filter panel
export interface WorkspaceInfo {
  id: string;
  name: string;
  color: string;
  avatar_url: string | null;
}

// Color palette for personal events
export const PERSONAL_EVENT_COLORS = [
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Slate', value: '#64748b' },
] as const;

export type PersonalEventColor = (typeof PERSONAL_EVENT_COLORS)[number]['value'];
