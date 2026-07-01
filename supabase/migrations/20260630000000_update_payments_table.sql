-- Migration: Update Payments Table with Razorpay Details
-- Date: 2026-06-30

ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS tax_paise INTEGER,
ADD COLUMN IF NOT EXISTS fee_paise INTEGER,
ADD COLUMN IF NOT EXISTS failure_reason TEXT,
ADD COLUMN IF NOT EXISTS billing_interval TEXT;
