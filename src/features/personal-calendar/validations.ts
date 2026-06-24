import { z } from 'zod';

export const CreatePersonalEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().nullable().optional(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color').default('#6366f1'),
}).refine((data) => new Date(data.end_at) >= new Date(data.start_at), {
  message: 'End time must be after or equal to start time',
  path: ['end_at'],
});

export const UpdatePersonalEventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(255).optional(),
  description: z.string().nullable().optional(),
  start_at: z.string().datetime().optional(),
  end_at: z.string().datetime().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color').optional(),
}).refine((data) => {
  if (data.start_at && data.end_at) {
    return new Date(data.end_at) >= new Date(data.start_at);
  }
  return true;
}, {
  message: 'End time must be after or equal to start time',
  path: ['end_at'],
});
