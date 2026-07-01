-- FIX SUBSCRIPTION PLAN ID REFERENCES
-- This migration fixes existing subscriptions by mapping them to valid plan_ids via plan key
-- Use this if you already applied the overhaul and have invalid plan_id references

-- Step 1: Update existing subscriptions to use valid plan_ids
UPDATE public.subscriptions s
SET plan_id = (
    SELECT id 
    FROM public.plans 
    WHERE key = COALESCE(
        (SELECT key FROM public.plans_backup WHERE id = s.plan_id LIMIT 1),
        'free'
    )
    LIMIT 1
);

-- Step 2: Verify all subscriptions now have valid plan_ids
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM public.subscriptions s
        LEFT JOIN public.plans p ON s.plan_id = p.id
        WHERE p.id IS NULL
    ) THEN
        RAISE NOTICE 'Warning: Some subscriptions still have invalid plan_ids, setting them to free';
        UPDATE public.subscriptions
        SET plan_id = (SELECT id FROM public.plans WHERE key = 'free' LIMIT 1)
        WHERE plan_id NOT IN (SELECT id FROM public.plans);
    END IF;
END $$;
