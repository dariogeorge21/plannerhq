-- Migration: Calendar Events, Attendees, Mentions
-- Date: 2026-06-22

-- 1. Create calendar_events table
CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    mention_all BOOLEAN NOT NULL DEFAULT false,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for calendar_events
CREATE INDEX calendar_events_workspace_id_idx ON public.calendar_events (workspace_id);
CREATE INDEX calendar_events_dates_idx ON public.calendar_events (workspace_id, start_at, end_at);
CREATE INDEX calendar_events_created_by_idx ON public.calendar_events (created_by);

-- 2. Create event_attendees table
CREATE TABLE public.event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rsvp_status TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'accepted', 'declined')),
    added_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, user_id)
);

-- Indexes for event_attendees
CREATE INDEX event_attendees_event_id_idx ON public.event_attendees (event_id);
CREATE INDEX event_attendees_user_id_idx ON public.event_attendees (user_id);

-- 3. Create event_mentions table
CREATE TABLE public.event_mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mentioned_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, user_id)
);

-- Indexes for event_mentions
CREATE INDEX event_mentions_event_id_idx ON public.event_mentions (event_id);
CREATE INDEX event_mentions_user_id_idx ON public.event_mentions (user_id);

-- 4. Set up updated_at trigger for calendar_events
DROP TRIGGER IF EXISTS set_calendar_events_updated_at ON public.calendar_events;
CREATE TRIGGER set_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_mentions ENABLE ROW LEVEL SECURITY;

-- 6. Setup RLS Policies using existing helpers
-- Helpers used: public.is_workspace_member() and public.is_workspace_admin()

-- calendar_events policies
CREATE POLICY "Workspace members can view calendar events" ON public.calendar_events
  FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can create calendar events" ON public.calendar_events
  FOR INSERT
  WITH CHECK (
    public.is_workspace_member(workspace_id)
  );

CREATE POLICY "Workspace members can update calendar events" ON public.calendar_events
  FOR UPDATE
  USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can delete calendar events" ON public.calendar_events
  FOR DELETE
  USING (public.is_workspace_member(workspace_id));


-- event_attendees policies (relies on event visibility)
CREATE POLICY "Workspace members can view attendees" ON public.event_attendees
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_events e
      WHERE e.id = event_attendees.event_id
      AND public.is_workspace_member(e.workspace_id)
    )
  );

CREATE POLICY "Workspace members can add attendees" ON public.event_attendees
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.calendar_events e
      WHERE e.id = event_attendees.event_id
      AND public.is_workspace_member(e.workspace_id)
    )
  );

CREATE POLICY "Users can update their own RSVP" ON public.event_attendees
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Members can delete attendees" ON public.event_attendees
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_events e
      WHERE e.id = event_attendees.event_id
      AND public.is_workspace_member(e.workspace_id)
    )
  );


-- event_mentions policies
CREATE POLICY "Workspace members can view mentions" ON public.event_mentions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_events e
      WHERE e.id = event_mentions.event_id
      AND public.is_workspace_member(e.workspace_id)
    )
  );

CREATE POLICY "Workspace members can create mentions" ON public.event_mentions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.calendar_events e
      WHERE e.id = event_mentions.event_id
      AND public.is_workspace_member(e.workspace_id)
    )
  );

CREATE POLICY "Workspace members can delete mentions" ON public.event_mentions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_events e
      WHERE e.id = event_mentions.event_id
      AND public.is_workspace_member(e.workspace_id)
    )
  );

-- 7. Role Access Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_attendees TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_mentions TO authenticated;
