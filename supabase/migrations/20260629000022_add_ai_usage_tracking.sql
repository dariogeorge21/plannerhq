-- ============================================================================
-- Migration: Add AI Usage Tracking
-- File:      20260629000022_add_ai_usage_tracking.sql
-- Date:      2026-06-29
-- Purpose:   Creates the ai_usage_tracking table to log every GROQ API call
--            made by a user. The existing subscription_usage.ai_tokens_used
--            column is the running total; this table holds the granular audit
--            trail (action type, tokens consumed, timestamp).
-- ============================================================================


-- ─── 1. Create ai_usage_tracking table ────────────────────────────────────────

create table if not exists public.ai_usage_tracking (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  action       text        not null default 'unknown'
                             check (action in ('generate', 'rewrite', 'summarize', 'translate', 'unknown')),
  tokens_used  integer     not null default 0 check (tokens_used >= 0),
  model        text        not null default 'openai/gpt-oss-20b',
  created_at   timestamptz not null default now()
  -- No updated_at: rows are immutable audit records; never updated after insert.
);

comment on table  public.ai_usage_tracking                 is 'Immutable log of every GROQ API call: one row per request.';
comment on column public.ai_usage_tracking.action         is 'The AI action performed (generate, rewrite, summarize, translate).';
comment on column public.ai_usage_tracking.tokens_used    is 'Total tokens consumed by this request (from GROQ usage.total_tokens).';
comment on column public.ai_usage_tracking.model          is 'The GROQ model used (e.g. openai/gpt-oss-20b).';


-- ─── 2. Indexes ───────────────────────────────────────────────────────────────

-- Primary lookup: per-user usage ordered by time
create index if not exists ai_usage_tracking_user_id_created_at_idx
  on public.ai_usage_tracking (user_id, created_at desc);

-- Aggregate queries by action type
create index if not exists ai_usage_tracking_action_idx
  on public.ai_usage_tracking (action);


-- ─── 3. Row Level Security ────────────────────────────────────────────────────

alter table public.ai_usage_tracking enable row level security;

-- Users can read their own usage records
create policy "Users can view their own AI usage"
  on public.ai_usage_tracking for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Insert is performed server-side via service_role; authenticated users
-- must NOT be able to insert fabricated usage records.
-- (No INSERT policy for authenticated role.)

-- The service_role bypasses RLS by design — the API route uses the
-- service_role key to record usage after each GROQ call.


-- ─── 4. Data API grants ───────────────────────────────────────────────────────

-- Allow authenticated users to SELECT their own rows (RLS enforced above).
-- INSERT/UPDATE/DELETE remain with service_role only (no grant needed — 
-- service_role bypasses RLS and already has full access).
grant select on public.ai_usage_tracking to authenticated;


-- ─── 5. Backfill helpers (optional – safe to run on a live DB) ───────────────

-- No data to backfill; this table starts empty.
-- The subscription_usage.ai_tokens_used column already tracks the running
-- total and is not affected by this migration.


-- ─── 6. (Optional) Daily usage view ─────────────────────────────────────────
-- Convenience view for per-day token summaries (used by future analytics).

create or replace view public.ai_usage_daily as
select
  user_id,
  date_trunc('day', created_at at time zone 'UTC') as usage_date,
  action,
  sum(tokens_used)  as tokens_used,
  count(*)          as request_count
from public.ai_usage_tracking
group by user_id, date_trunc('day', created_at at time zone 'UTC'), action;

-- Revoke default public access on view; grant only to authenticated role.
revoke all on public.ai_usage_daily from public;
grant  select on public.ai_usage_daily to authenticated;

-- Because views bypass RLS by default (Postgres <15), we make it
-- security_invoker so it respects the calling user's RLS context.
-- (Supported in Postgres 15+, which Supabase uses on new projects.)
alter view public.ai_usage_daily set (security_invoker = true);
