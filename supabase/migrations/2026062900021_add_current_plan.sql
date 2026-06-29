-- 1. Add current_plan column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_plan TEXT NOT NULL DEFAULT 'free';

-- 2. Add index on subscriptions for fast user lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status
  ON public.subscriptions (user_id, status);

-- 3. Ensure subscription_usage has a unique constraint on user_id
--    (needed for upsert ON CONFLICT)
ALTER TABLE public.subscription_usage
  ADD CONSTRAINT subscription_usage_user_id_key UNIQUE (user_id);
