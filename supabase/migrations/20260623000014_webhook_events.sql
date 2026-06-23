-- Migration: Add Webhook Events Table
-- Date: 2026-06-23

-- Create webhook_events table to track all incoming Razorpay events
CREATE TABLE public.webhook_events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_event_id     TEXT UNIQUE,
  event_type            TEXT NOT NULL,
  payload               JSONB NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for searching by event ID or type
CREATE INDEX webhook_events_razorpay_event_id_idx ON public.webhook_events (razorpay_event_id);
CREATE INDEX webhook_events_event_type_idx ON public.webhook_events (event_type);

-- Enable RLS for webhook_events (admin only via service role)
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- We don't need to add any policies because this table is only written to 
-- by the server-side webhook handler using the service_role key, which bypasses RLS.
-- No client should be able to read or write to this table.
