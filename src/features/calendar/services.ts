import { SupabaseClient } from "@supabase/supabase-js";
import { 
  CalendarEventWithDetails, 
  CalendarTask, 
  WorkspaceMemberOption,
  CalendarEvent
} from "./types";

export const createCalendarService = (supabase: SupabaseClient) => ({
  async getEventsForRange(workspaceId: string, startDate: string, endDate: string): Promise<CalendarEventWithDetails[]> {
    const { data, error } = await supabase
      .from("calendar_events")
      .select(`
        *,
        attendees:event_attendees(*),
        mentions:event_mentions(*)
      `)
      .eq("workspace_id", workspaceId)
      .gte("end_at", startDate)
      .lte("start_at", endDate)
      .order("start_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getEventById(eventId: string): Promise<CalendarEventWithDetails> {
    const { data, error } = await supabase
      .from("calendar_events")
      .select(`
        *,
        attendees:event_attendees(*),
        mentions:event_mentions(*)
      `)
      .eq("id", eventId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getTasksWithDueDates(workspaceId: string, startDate: string, endDate: string): Promise<CalendarTask[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, workspace_id, title, description, status, priority, due_date, completed")
      .eq("workspace_id", workspaceId)
      .eq("is_deleted", false)
      .not("due_date", "is", null)
      .gte("due_date", startDate)
      .lte("due_date", endDate)
      .order("due_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data as CalendarTask[];
  },

  async createEvent(
    workspaceId: string,
    title: string,
    description: string | null,
    startAt: string,
    endAt: string,
    priority: string,
    mentionAll: boolean,
    attendeeIds: string[],
    mentionIds: string[],
    userId: string
  ): Promise<CalendarEvent> {
    // 1. Create the event
    const { data: event, error: eventError } = await supabase
      .from("calendar_events")
      .insert({
        workspace_id: workspaceId,
        title,
        description,
        start_at: startAt,
        end_at: endAt,
        priority,
        mention_all: mentionAll,
        created_by: userId
      })
      .select()
      .single();

    if (eventError) throw new Error(eventError.message);

    // 2. Insert attendees
    if (attendeeIds.length > 0) {
      const attendeesData = attendeeIds.map(id => ({
        event_id: event.id,
        user_id: id,
        rsvp_status: 'pending',
        added_by: userId
      }));
      const { error: attendeesError } = await supabase.from("event_attendees").insert(attendeesData);
      if (attendeesError) console.error("Error inserting attendees:", attendeesError);
    }

    // 3. Insert mentions
    if (mentionIds.length > 0 && !mentionAll) {
      const mentionsData = mentionIds.map(id => ({
        event_id: event.id,
        user_id: id,
        mentioned_by: userId
      }));
      const { error: mentionsError } = await supabase.from("event_mentions").insert(mentionsData);
      if (mentionsError) console.error("Error inserting mentions:", mentionsError);
    }

    return event;
  },

  async updateEvent(
    eventId: string,
    updates: Partial<Omit<CalendarEvent, 'id' | 'workspace_id' | 'created_by' | 'created_at' | 'updated_at'>>,
    attendeeIds?: string[],
    mentionIds?: string[],
    userId?: string
  ): Promise<CalendarEvent> {
    // 1. Update event
    const { data: event, error: eventError } = await supabase
      .from("calendar_events")
      .update(updates)
      .eq("id", eventId)
      .select()
      .single();

    if (eventError) throw new Error(eventError.message);

    // 2. Sync attendees if provided
    if (attendeeIds && userId) {
      // Get current attendees
      const { data: currentAttendees } = await supabase.from("event_attendees").select("user_id").eq("event_id", eventId);
      const currentAttendeeIds = (currentAttendees || []).map(a => a.user_id);
      
      const toAdd = attendeeIds.filter(id => !currentAttendeeIds.includes(id));
      const toRemove = currentAttendeeIds.filter(id => !attendeeIds.includes(id));

      if (toRemove.length > 0) {
        await supabase.from("event_attendees").delete().eq("event_id", eventId).in("user_id", toRemove);
      }
      
      if (toAdd.length > 0) {
        const attendeesData = toAdd.map(id => ({
          event_id: eventId,
          user_id: id,
          rsvp_status: 'pending',
          added_by: userId
        }));
        await supabase.from("event_attendees").insert(attendeesData);
      }
    }

    // 3. Sync mentions if provided
    if (mentionIds && userId) {
      if (updates.mention_all) {
        // If mention_all is set, clear individual mentions
        await supabase.from("event_mentions").delete().eq("event_id", eventId);
      } else {
        const { data: currentMentions } = await supabase.from("event_mentions").select("user_id").eq("event_id", eventId);
        const currentMentionIds = (currentMentions || []).map(m => m.user_id);
        
        const toAdd = mentionIds.filter(id => !currentMentionIds.includes(id));
        const toRemove = currentMentionIds.filter(id => !mentionIds.includes(id));

        if (toRemove.length > 0) {
          await supabase.from("event_mentions").delete().eq("event_id", eventId).in("user_id", toRemove);
        }
        
        if (toAdd.length > 0) {
          const mentionsData = toAdd.map(id => ({
            event_id: eventId,
            user_id: id,
            mentioned_by: userId
          }));
          await supabase.from("event_mentions").insert(mentionsData);
        }
      }
    }

    return event;
  },

  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase.from("calendar_events").delete().eq("id", eventId);
    if (error) throw new Error(error.message);
  },

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberOption[]> {
    const { data, error } = await supabase
      .from("workspace_members")
      .select(`
        user_id,
        role,
        profiles(display_name, email, hqid, avatar_url)
      `)
      .eq("workspace_id", workspaceId);

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      user_id: row.user_id,
      role: row.role,
      display_name: row.profiles?.display_name || "",
      email: row.profiles?.email || "",
      hqid: row.profiles?.hqid || "",
      avatar_url: row.profiles?.avatar_url || null,
    }));
  }
});
