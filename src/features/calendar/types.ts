export type CalendarEventPriority = 'low' | 'medium' | 'high';
export type AttendeeRsvpStatus = 'pending' | 'accepted' | 'declined';

export interface CalendarEvent {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  priority: CalendarEventPriority;
  mention_all: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  rsvp_status: AttendeeRsvpStatus;
  added_by: string;
  created_at: string;
}

export interface EventMention {
  id: string;
  event_id: string;
  user_id: string;
  mentioned_by: string;
  created_at: string;
}

export interface CalendarEventWithDetails extends CalendarEvent {
  attendees: EventAttendee[];
  mentions: EventMention[];
}

// For read-only tasks that appear on the calendar
export interface CalendarTask {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string; // Guaranteed to be non-null for calendar tasks
  completed: boolean;
}

export interface WorkspaceMemberOption {
  user_id: string;
  role: string;
  display_name: string;
  email: string;
  hqid: string;
  avatar_url: string | null;
}
