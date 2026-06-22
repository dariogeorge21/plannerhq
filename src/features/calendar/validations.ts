import { z } from 'zod';

export const CreateEventSchema = z.object({
  workspace_id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().nullable().optional(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  mention_all: z.boolean().default(false),
  attendee_ids: z.array(z.string().uuid()).default([]),
  mention_ids: z.array(z.string().uuid()).default([]),
}).refine(data => new Date(data.end_at) >= new Date(data.start_at), {
  message: "End time must be after or equal to start time",
  path: ["end_at"],
});

export const UpdateEventSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z.string().nullable().optional(),
  start_at: z.string().datetime().optional(),
  end_at: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  mention_all: z.boolean().optional(),
  attendee_ids: z.array(z.string().uuid()).optional(),
  mention_ids: z.array(z.string().uuid()).optional(),
}).refine(data => {
  if (data.start_at && data.end_at) {
    return new Date(data.end_at) >= new Date(data.start_at);
  }
  return true;
}, {
  message: "End time must be after or equal to start time",
  path: ["end_at"],
});

export const MentionSchema = z.object({
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

export const AttendeeSchema = z.object({
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
});
