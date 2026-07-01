-- Seed all available plans (free, pro, ultra, enterprise)
-- This adds the missing pro and ultra plans that are needed for the billing page

INSERT INTO public.plans (
  key, name, description, monthly_price_paise, yearly_price_paise,
  max_workspaces, max_sections, max_storage_bytes, max_ai_tokens,
  max_collaborators, version_history_days, max_file_upload_bytes
) VALUES 
  -- Free plan (already exists probably, but on conflict do nothing)
  ('free', 'Free Starter', 'Perfect for personal use and getting started with PlannerHQ', 0, 0, 3, 2, 104857600, 200000, 2, 7, 1048576),
  
  -- Pro plan
  ('pro', 'Pro', 'For small teams and professionals who need more power', 29900, 287040, 10, 20, 10737418240, 500000, 10, 30, 52428800),
  
  -- Ultra plan
  ('ultra', 'Ultra', 'For growing teams and power users', 79900, 767040, 50, 100, 107374182400, 2000000, 50, 90, 104857600),
  
  -- Enterprise plan
  ('enterprise', 'Enterprise', 'Custom solutions for large organizations', 0, 0, 999999, 999999, 1099511627776, 999999999, 999999, 365, 1073741824)
ON CONFLICT (key) DO NOTHING;
