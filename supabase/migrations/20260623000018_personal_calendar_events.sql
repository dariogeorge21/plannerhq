-- Migration: personal_calendar_events
-- Personal calendar events belong to a user (not a workspace)
-- Users can CRUD their own events; workspace events are read-only via separate queries

CREATE TABLE IF NOT EXISTS personal_calendar_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 255),
  description TEXT,
  start_at    TIMESTAMPTZ NOT NULL,
  end_at      TIMESTAMPTZ NOT NULL CHECK (end_at >= start_at),
  color       TEXT NOT NULL DEFAULT '#6366f1',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_personal_calendar_events_user_id ON personal_calendar_events(user_id);
CREATE INDEX idx_personal_calendar_events_start_at ON personal_calendar_events(start_at);
CREATE INDEX idx_personal_calendar_events_range ON personal_calendar_events(user_id, start_at, end_at);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_personal_calendar_events_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_personal_calendar_events_updated_at
  BEFORE UPDATE ON personal_calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_personal_calendar_events_updated_at();

-- RLS
ALTER TABLE personal_calendar_events ENABLE ROW LEVEL SECURITY;

-- SELECT: owner only
CREATE POLICY "personal_events_select"
  ON personal_calendar_events
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- INSERT: owner only
CREATE POLICY "personal_events_insert"
  ON personal_calendar_events
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- UPDATE: owner only (both USING and WITH CHECK to prevent user_id reassignment)
CREATE POLICY "personal_events_update"
  ON personal_calendar_events
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- DELETE: owner only
CREATE POLICY "personal_events_delete"
  ON personal_calendar_events
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
