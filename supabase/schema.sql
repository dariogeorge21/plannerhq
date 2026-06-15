-- ====================================================================
-- PLANNERHQ AUTHENTICATION AND PROFILE SCHEMA
-- Location: supabase/schema.sql
-- ====================================================================

-- 1. Create handle_updated_at helper function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- 2. Create public.profiles table
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  avatar_url    text,
  hqid          text not null unique,  -- public identifier, e.g., "jane-doe-a3b7"
  email         text not null,
  theme         text not null default 'system' check (theme in ('light', 'dark', 'system')),
  timezone      text default 'UTC',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Indexes
create unique index profiles_hqid_idx on public.profiles (hqid);
create index profiles_email_idx on public.profiles (email);

-- Apply updated_at trigger
create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();


-- 3. Create public.plans table
create table public.plans (
  id                    uuid primary key default gen_random_uuid(),
  key                   text not null unique check (key in ('free', 'pro', 'plus', 'enterprise')),
  name                  text not null,
  monthly_price_paise   integer not null default 0, -- Razorpay uses paise
  yearly_price_paise    integer not null default 0,
  currency              text not null default 'INR',
  max_workspaces        integer not null default 3,
  max_sections          integer not null default 2,
  max_storage_bytes     bigint not null default 104857600,  -- 100MB
  max_ai_tokens         bigint not null default 200000,
  ai_token_period       text not null default 'total' check (ai_token_period in ('total', 'daily')),
  max_collaborators     integer not null default 2,
  version_history_days  integer not null default 7,
  max_file_upload_bytes bigint not null default 1048576,    -- 1MB
  max_workspace_admins  integer not null default 0,
  max_tasks_per_ws      integer,       -- null = unlimited
  max_events_per_month  integer,       -- null = unlimited
  audit_log_days        integer default 0,
  has_custom_roles      boolean not null default false,
  has_google_sync       boolean not null default false,
  has_google_meet       boolean not null default false,
  has_sla               boolean not null default false,
  razorpay_plan_id_monthly text,
  razorpay_plan_id_yearly  text,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Seed Plans
insert into public.plans (key, name, monthly_price_paise, yearly_price_paise, max_workspaces, max_sections, max_storage_bytes, max_ai_tokens, max_collaborators, version_history_days, max_file_upload_bytes)
values 
  ('free', 'Free Starter', 0, 0, 3, 2, 104857600, 200000, 2, 7, 1048576)
on conflict (key) do nothing;


-- 4. Create public.subscriptions table
create table public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  plan_id               uuid not null references public.plans(id),
  status                text not null default 'active'
                          check (status in ('active', 'trialing', 'past_due', 'cancelled', 'expired')),
  billing_cycle         text not null default 'monthly'
                          check (billing_cycle in ('monthly', 'yearly')),
  razorpay_subscription_id text,
  razorpay_customer_id     text,
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  trial_end             timestamptz,
  cancelled_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Indexes
create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_status_idx on public.subscriptions (status);
create unique index subscriptions_user_active_idx on public.subscriptions (user_id) where status in ('active', 'trialing');

-- Apply updated_at trigger
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.handle_updated_at();


-- 5. Auto-create profile and free subscription on signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
declare
  free_plan_id uuid;
begin
  -- Retrieve the plan ID for the free plan
  select id into free_plan_id from public.plans where key = 'free';

  -- Create the public profile record
  insert into public.profiles (id, display_name, email, hqid)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email,
    lower(replace(coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), ' ', '-'))
      || '-' || substr(new.id::text, 1, 4)
  );

  -- Create free subscription record
  if free_plan_id is not null then
    insert into public.subscriptions (user_id, plan_id, status)
    values (new.id, free_plan_id, 'active');
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = '';

-- Bind trigger to auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ====================================================================
-- SECURITY & ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles Policies
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Plans Policies
create policy "Plans are publicly readable"
  on public.plans for select
  to anon, authenticated
  using (true);

-- Subscriptions Policies
create policy "Users can view own subscription"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ====================================================================
-- ROLE ACCESS GRANTS (Data API Exposure)
-- ====================================================================
grant select on public.plans to anon, authenticated;
grant select on public.profiles to authenticated;
grant update on public.profiles to authenticated;
grant select on public.subscriptions to authenticated;
