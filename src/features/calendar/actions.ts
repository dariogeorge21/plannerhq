"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createCalendarService } from "./services";
import { CreateEventSchema, UpdateEventSchema } from "./validations";
import { LogWorkspaceActivity } from "../workspace/workspace";

export async function createEventAction(payload: unknown) {
  try {
    const data = CreateEventSchema.parse(payload);
    const supabase = await createClient();
    const service = createCalendarService(supabase);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Unauthorized");

    const event = await service.createEvent(
      data.workspace_id,
      data.title,
      data.description || null,
      data.start_at,
      data.end_at,
      data.priority,
      data.mention_all,
      data.attendee_ids,
      data.mention_ids,
      userData.user.id
    );

    await LogWorkspaceActivity(data.workspace_id, "create_calendar_event", "calendar_event", event.id, { title: data.title });
    revalidatePath(`/${data.workspace_id}/calendar`);
    return { success: true, data: event };
  } catch (error: any) {
    console.error("createEventAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateEventAction(payload: unknown) {
  try {
    const data = UpdateEventSchema.parse(payload);
    const supabase = await createClient();
    const service = createCalendarService(supabase);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Unauthorized");

    const { id, workspace_id, attendee_ids, mention_ids, ...updates } = data;
    
    const event = await service.updateEvent(
      id,
      updates as any,
      attendee_ids,
      mention_ids,
      userData.user.id
    );

    await LogWorkspaceActivity(workspace_id, "update_calendar_event", "calendar_event", id, { updates });
    revalidatePath(`/${workspace_id}/calendar`);
    return { success: true, data: event };
  } catch (error: any) {
    console.error("updateEventAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEventAction(eventId: string, workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createCalendarService(supabase);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Unauthorized");

    await service.deleteEvent(eventId);
    await LogWorkspaceActivity(workspaceId, "delete_calendar_event", "calendar_event", eventId, {});
    revalidatePath(`/${workspaceId}/calendar`);
    return { success: true };
  } catch (error: any) {
    console.error("deleteEventAction error:", error);
    return { success: false, error: error.message };
  }
}
