-- PlannerHQ Billing Fixes Migration

-- 1. Ensure `webhook_events` has a unique constraint on `razorpay_event_id`
-- This allows idempotency in webhook processing using ON CONFLICT.
ALTER TABLE webhook_events
ADD CONSTRAINT webhook_events_event_id_unique UNIQUE (razorpay_event_id);

-- 2. Add a unique index on `subscriptions` for active/trialing/past_due subscriptions
-- This allows atomic UPSERTs when updating an existing user's active subscription.
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_active_unique 
ON subscriptions (user_id) 
WHERE status IN ('active', 'trialing', 'past_due');

-- 3. Add `subscription_id` to `payments` table to link payments to subscriptions
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS subscription_id TEXT REFERENCES subscriptions(razorpay_subscription_id);

-- 4. Create an RPC function to atomically increment workspace count
-- This resolves the read-modify-write race condition in the service layer.
CREATE OR REPLACE FUNCTION increment_workspace_count(p_user_id UUID, p_increment INT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE subscription_usage
  SET workspaces_count = workspaces_count + p_increment,
      updated_at = NOW()
  WHERE user_id = p_user_id;
$$;

