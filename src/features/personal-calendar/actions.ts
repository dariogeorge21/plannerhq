'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createPersonalCalendarService } from './services';
import { CreatePersonalEventSchema, UpdatePersonalEventSchema } from './validations';

export async function createPersonalEventAction(payload: unknown): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const data = CreatePersonalEventSchema.parse(payload);
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Unauthorized');

    const service = createPersonalCalendarService(supabase);
    const event = await service.createPersonalEvent(
      userData.user.id,
      data.title,
      data.description || null,
      data.start_at,
      data.end_at,
      data.color
    );

    revalidatePath('/calendar');
    return { success: true, data: event };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('createPersonalEventAction error:', error);
    return { success: false, error: message };
  }
}

export async function updatePersonalEventAction(payload: unknown): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const data = UpdatePersonalEventSchema.parse(payload);
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Unauthorized');

    const service = createPersonalCalendarService(supabase);
    const { id, ...updates } = data;
    const event = await service.updatePersonalEvent(id, updates);

    revalidatePath('/calendar');
    return { success: true, data: event };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('updatePersonalEventAction error:', error);
    return { success: false, error: message };
  }
}

export async function deletePersonalEventAction(eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Unauthorized');

    const service = createPersonalCalendarService(supabase);
    await service.deletePersonalEvent(eventId);

    revalidatePath('/calendar');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('deletePersonalEventAction error:', error);
    return { success: false, error: message };
  }
}
