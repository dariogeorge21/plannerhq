import { z } from 'zod';

export const TaskSectionSchema = z.object({
  workspace_id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(100),
  sort_order: z.number().int().default(0),
});

export const TaskSchema = z.object({
  workspace_id: z.string().uuid(),
  section_id: z.string().uuid().nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'blocked', 'cancelled']).default('todo'),
  priority: z.enum(['none', 'low', 'medium', 'high', 'urgent']).default('none'),
  due_date: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  completed: z.boolean().default(false),
  viewed_by: z.array(z.string().uuid()).default([]),
  reviewed_by: z.array(z.string().uuid()).default([]),
});

export const TaskUpdateSchema = TaskSchema.partial().extend({
  id: z.string().uuid(),
});

export const TaskSectionUpdateSchema = TaskSectionSchema.partial().extend({
  id: z.string().uuid(),
});

export const TaskAssigneeSchema = z.object({
  task_id: z.string().uuid(),
  user_id: z.string().uuid(),
});
