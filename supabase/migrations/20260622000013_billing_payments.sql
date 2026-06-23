-- Migration: Add Payments and Billing Columns
-- Date: 2026-06-22

-- 1. Add new columns to subscriptions
ALTER TABLE public.subscriptions 
ADD COLUMN cancel_at_period_end BOOLEAN NOT NULL DEFAULT false;

-- 2. Add new columns to subscription_usage
ALTER TABLE public.subscription_usage 
ADD COLUMN collaborators_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN sections_count INTEGER NOT NULL DEFAULT 0;

-- 3. Create payments table
CREATE TABLE public.payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id       UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  razorpay_payment_id   TEXT NOT NULL UNIQUE,
  razorpay_order_id     TEXT,
  amount_paise          INTEGER NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'INR',
  status                TEXT NOT NULL,
  invoice_reference     TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX payments_user_id_idx ON public.payments (user_id);
CREATE INDEX payments_subscription_id_idx ON public.payments (subscription_id);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- 4. Grants for Data API
GRANT SELECT ON public.payments TO authenticated;

-- 5. Seed actual prices into plans
UPDATE public.plans 
SET 
  monthly_price_paise = 29900, 
  yearly_price_paise = 39900
WHERE key = 'pro';

-- If ultra exists, set it. Note: user will manually rename ultra to ultra later, 
-- but we update the pricing here on 'ultra' so it reflects correctly before/after rename.
UPDATE public.plans 
SET 
  monthly_price_paise = 89900, 
  yearly_price_paise = 79900
WHERE key = 'ultra';

-- Ensure Enterprise is Custom (0 paise, handles in code)
UPDATE public.plans 
SET 
  monthly_price_paise = 0, 
  yearly_price_paise = 0
WHERE key = 'enterprise';
