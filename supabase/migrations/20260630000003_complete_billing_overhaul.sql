-- ====================================================================
-- COMPREHENSIVE BILLING SYSTEM DATABASE MIGRATION
-- Production-Grade Overhaul
-- ====================================================================

-- 1. FIRST: BACKUP EXISTING DATA (SAFETY FIRST!)
-- Create backup tables for existing billing data (in case we need to restore)
CREATE TABLE IF NOT EXISTS public.plans_backup AS TABLE public.plans;
CREATE TABLE IF NOT EXISTS public.subscriptions_backup AS TABLE public.subscriptions;
CREATE TABLE IF NOT EXISTS public.subscription_usage_backup AS TABLE public.subscription_usage;
CREATE TABLE IF NOT EXISTS public.payments_backup AS TABLE public.payments;
CREATE TABLE IF NOT EXISTS public.webhook_events_backup AS TABLE public.webhook_events;

-- 2. DROP EXISTING TABLES IN DEPENDENCY ORDER
DROP TABLE IF EXISTS public.webhook_events CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.subscription_usage CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;

-- 3. RECREATE PLANS TABLE (PRODUCTION SCHEMA)
CREATE TABLE public.plans (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key                   TEXT NOT NULL UNIQUE CHECK (key IN ('free', 'pro', 'ultra', 'enterprise')),
    name                  TEXT NOT NULL,
    description           TEXT,
    monthly_price_paise   INTEGER NOT NULL DEFAULT 0, -- Amount in paise (Razorpay uses paise)
    yearly_price_paise    INTEGER NOT NULL DEFAULT 0,
    currency              TEXT NOT NULL DEFAULT 'INR',
    max_workspaces        INTEGER NOT NULL DEFAULT 3,
    max_sections          INTEGER NOT NULL DEFAULT 2,
    max_storage_bytes     BIGINT NOT NULL DEFAULT 104857600,  -- 100MB
    max_ai_tokens         BIGINT NOT NULL DEFAULT 200000,
    ai_token_period       TEXT NOT NULL DEFAULT 'total' CHECK (ai_token_period IN ('total', 'daily')),
    max_collaborators     INTEGER NOT NULL DEFAULT 2,
    version_history_days  INTEGER NOT NULL DEFAULT 7,
    max_file_upload_bytes BIGINT NOT NULL DEFAULT 1048576,    -- 1MB
    max_workspace_admins  INTEGER NOT NULL DEFAULT 0,
    max_tasks_per_ws      INTEGER,       -- null = unlimited
    max_events_per_month  INTEGER,       -- null = unlimited
    audit_log_days        INTEGER DEFAULT 0,
    has_custom_roles      BOOLEAN NOT NULL DEFAULT false,
    has_google_sync       BOOLEAN NOT NULL DEFAULT false,
    has_google_meet       BOOLEAN NOT NULL DEFAULT false,
    has_sla               BOOLEAN NOT NULL DEFAULT false,
    razorpay_plan_id_monthly TEXT,
    razorpay_plan_id_yearly  TEXT,
    is_active             BOOLEAN NOT NULL DEFAULT true,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RECREATE SUBSCRIPTIONS TABLE
CREATE TABLE public.subscriptions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id               UUID NOT NULL REFERENCES public.plans(id),
    status                TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'expired')),
    billing_cycle         TEXT NOT NULL DEFAULT 'monthly'
                          CHECK (billing_cycle IN ('monthly', 'yearly')),
    razorpay_subscription_id TEXT,
    razorpay_customer_id     TEXT,
    current_period_start  TIMESTAMPTZ,
    current_period_end    TIMESTAMPTZ,
    cancel_at_period_end  BOOLEAN NOT NULL DEFAULT false,
    trial_end             TIMESTAMPTZ,
    cancelled_at          TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for subscriptions
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_active_unique 
ON public.subscriptions(user_id) 
WHERE status IN ('active', 'trialing', 'past_due');

-- 5. RECREATE SUBSCRIPTION USAGE TABLE
CREATE TABLE public.subscription_usage (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id       UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspaces_count      INTEGER NOT NULL DEFAULT 0,
    collaborators_count   INTEGER NOT NULL DEFAULT 0,
    sections_count        INTEGER NOT NULL DEFAULT 0,
    storage_used_bytes    BIGINT NOT NULL DEFAULT 0,
    ai_tokens_used        BIGINT NOT NULL DEFAULT 0,
    events_current_month  INTEGER NOT NULL DEFAULT 0,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(subscription_id),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS sub_usage_user_id_idx ON public.subscription_usage(user_id);

-- 6. RECREATE PAYMENTS TABLE (WITH ENHANCED FIELDS)
CREATE TABLE public.payments (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id       UUID REFERENCES public.subscriptions(id),
    razorpay_payment_id   TEXT NOT NULL,
    razorpay_order_id     TEXT,
    razorpay_subscription_id TEXT,
    amount_paise          INTEGER NOT NULL,
    currency              TEXT NOT NULL DEFAULT 'INR',
    status                TEXT NOT NULL,
    invoice_reference     TEXT,
    invoice_url           TEXT,
    receipt_number        TEXT,
    payment_method        TEXT,
    tax_paise             INTEGER,
    fee_paise             INTEGER,
    discount_paise        INTEGER,
    total_amount_paise    INTEGER,
    billing_interval      TEXT,
    failure_reason        TEXT,
    paid_at               TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS payments_razorpay_payment_id_idx ON public.payments(razorpay_payment_id);

-- 7. RECREATE WEBHOOK EVENTS TABLE
CREATE TABLE public.webhook_events (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razorpay_event_id     TEXT UNIQUE,
    event_type            TEXT NOT NULL,
    payload               JSONB NOT NULL,
    processed             BOOLEAN NOT NULL DEFAULT false,
    processed_at          TIMESTAMPTZ,
    error_message         TEXT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS webhook_events_razorpay_event_id_idx ON public.webhook_events(razorpay_event_id);
CREATE INDEX IF NOT EXISTS webhook_events_processed_idx ON public.webhook_events(processed);

-- 8. ADD UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_plans_updated_at BEFORE UPDATE ON public.plans
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_subscription_usage_updated_at BEFORE UPDATE ON public.subscription_usage
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. SEED PLANS WITH ALL AVAILABLE OPTIONS
INSERT INTO public.plans (
    key, name, description, monthly_price_paise, yearly_price_paise,
    max_workspaces, max_sections, max_storage_bytes, max_ai_tokens,
    max_collaborators, version_history_days, max_file_upload_bytes,
    has_custom_roles, has_google_sync, has_google_meet, is_active
) VALUES 
  -- Free plan
  ('free', 'Free Starter', 'Perfect for personal use and getting started with PlannerHQ', 0, 0, 3, 2, 104857600, 200000, 2, 7, 1048576, false, false, false, true),
  
  -- Pro plan
  ('pro', 'Pro', 'For small teams and professionals who need more power', 29900, 287040, 10, 20, 10737418240, 500000, 10, 30, 52428800, true, true, false, true),
  
  -- Ultra plan
  ('ultra', 'Ultra', 'For growing teams and power users', 79900, 767040, 50, 100, 107374182400, 2000000, 50, 90, 104857600, true, true, true, true),
  
  -- Enterprise plan
  ('enterprise', 'Enterprise', 'Custom solutions for large organizations', 0, 0, 999999, 999999, 1099511627776, 999999999, 999999, 365, 1073741824, true, true, true, true)
ON CONFLICT (key) DO NOTHING;

-- 10. ENABLE RLS AND CREATE POLICIES
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Plans policies
CREATE POLICY "Plans are publicly readable by everyone"
  ON public.plans FOR SELECT
  TO anon, authenticated
  USING (true);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Subscription usage policies
CREATE POLICY "Users can view their own usage"
  ON public.subscription_usage FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Payments policies
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Webhook events (only service role can access)
CREATE POLICY "Only service role can access webhook events"
  ON public.webhook_events FOR ALL
  TO service_role
  USING (true);

-- 11. GRANT PERMISSIONS
GRANT SELECT ON public.plans TO anon, authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT SELECT ON public.subscription_usage TO authenticated;
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.webhook_events TO service_role;

-- 12. RECREATE USER SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
  name_val TEXT;
  new_sub_id UUID;
BEGIN
  -- Retrieve the plan ID for the free plan
  SELECT id INTO free_plan_id FROM public.plans WHERE key = 'free';

  -- Extract display name from metadata
  name_val := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  -- Create profile
  INSERT INTO public.profiles (id, display_name, email, hqid, avatar_url)
  VALUES (
    NEW.id,
    name_val,
    NEW.email,
    LOWER(REPLACE(name_val, ' ', '-')) || '-' || SUBSTRING(NEW.id::TEXT, 1, 4),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );

  -- Create free subscription and usage record
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start)
    VALUES (NEW.id, free_plan_id, 'active', NOW())
    RETURNING id INTO new_sub_id;

    INSERT INTO public.subscription_usage (subscription_id, user_id, workspaces_count)
    VALUES (new_sub_id, NEW.id, 0);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 13. RECREATE INCREMENT WORKSPACE COUNT RPC
CREATE OR REPLACE FUNCTION public.increment_workspace_count(p_user_id UUID, p_increment INT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.subscription_usage
  SET workspaces_count = workspaces_count + p_increment,
      updated_at = NOW()
  WHERE user_id = p_user_id;
$$;

-- 14. RESTORE EXISTING USER DATA FROM BACKUPS (IF AVAILABLE)
-- First, create a mapping table from old plan IDs to new plan IDs using the plan key
CREATE TEMP TABLE plan_id_mapping AS
SELECT 
    old.id AS old_plan_id, 
    new.id AS new_plan_id
FROM public.plans_backup old
JOIN public.plans new ON old.key = new.key;

-- Restore subscriptions with mapped plan_ids
INSERT INTO public.subscriptions (id, user_id, plan_id, status, billing_cycle, razorpay_subscription_id, razorpay_customer_id, current_period_start, current_period_end, cancel_at_period_end, trial_end, cancelled_at, created_at, updated_at)
SELECT 
    s.id, 
    s.user_id, 
    COALESCE(p.new_plan_id, (SELECT id FROM public.plans WHERE key = 'free' LIMIT 1)), -- Fallback to free plan if no mapping
    s.status, 
    s.billing_cycle, 
    s.razorpay_subscription_id, 
    s.razorpay_customer_id, 
    s.current_period_start, 
    s.current_period_end, 
    COALESCE(s.cancel_at_period_end, false), 
    s.trial_end, 
    s.cancelled_at, 
    s.created_at, 
    s.updated_at
FROM public.subscriptions_backup s
LEFT JOIN plan_id_mapping p ON s.plan_id = p.old_plan_id
ON CONFLICT DO NOTHING;

-- Restore usage
INSERT INTO public.subscription_usage (id, subscription_id, user_id, workspaces_count, collaborators_count, sections_count, storage_used_bytes, ai_tokens_used, events_current_month, created_at, updated_at)
SELECT 
    id, 
    subscription_id, 
    user_id, 
    workspaces_count, 
    COALESCE(collaborators_count, 0), 
    COALESCE(sections_count, 0), 
    storage_used_bytes, 
    ai_tokens_used, 
    events_current_month, 
    created_at, 
    updated_at
FROM public.subscription_usage_backup
ON CONFLICT DO NOTHING;

-- Restore payments
INSERT INTO public.payments (id, user_id, subscription_id, razorpay_payment_id, razorpay_order_id, amount_paise, currency, status, invoice_reference, created_at, updated_at)
SELECT id, user_id, subscription_id, razorpay_payment_id, razorpay_order_id, amount_paise, currency, status, invoice_reference, created_at, updated_at
FROM public.payments_backup
ON CONFLICT DO NOTHING;

-- Restore webhook events
INSERT INTO public.webhook_events (id, razorpay_event_id, event_type, payload, created_at)
SELECT id, razorpay_event_id, event_type, payload, created_at
FROM public.webhook_events_backup
ON CONFLICT DO NOTHING;

-- Drop temporary mapping table
DROP TABLE plan_id_mapping;
