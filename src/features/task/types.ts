export interface TaskSection {
  id: string;
  workspace_id: string;
  name: string;
  sort_order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked' | 'cancelled';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  workspace_id: string;
  section_id: string | null;
  parent_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  sort_order: number;
  completed: boolean;
  viewed_by: string[];
  reviewed_by: string[];
  is_deleted: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignee {
  id: string;
  task_id: string;
  user_id: string;
  assigned_by: string;
  created_at: string;
}
