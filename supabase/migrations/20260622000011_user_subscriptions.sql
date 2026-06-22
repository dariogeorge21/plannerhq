-- Migration: Create Subscriptions and Subscription Usage Tables
-- Date: 2026-06-22

-- 1. Re-create public.subscriptions table
create table if not exists public.subscriptions (
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

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);
create unique index if not exists subscriptions_user_active_idx on public.subscriptions (user_id) where status in ('active', 'trialing');

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- 2. Create public.subscription_usage table
create table if not exists public.subscription_usage (
  id                    uuid primary key default gen_random_uuid(),
  subscription_id       uuid not null references public.subscriptions(id) on delete cascade,
  user_id               uuid not null references auth.users(id) on delete cascade,
  workspaces_count      integer not null default 0,
  storage_used_bytes    bigint not null default 0,
  ai_tokens_used        bigint not null default 0,
  events_current_month  integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique(subscription_id),
  unique(user_id)
);

create index if not exists sub_usage_user_id_idx on public.subscription_usage (user_id);

drop trigger if exists set_subscription_usage_updated_at on public.subscription_usage;
create trigger set_subscription_usage_updated_at before update on public.subscription_usage
  for each row execute function public.handle_updated_at();

-- 3. Enable RLS and define Policies
alter table public.subscriptions enable row level security;
alter table public.subscription_usage enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can view own usage"
  on public.subscription_usage for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 4. Grants for Data API
grant select on public.subscriptions to authenticated;
grant select on public.subscription_usage to authenticated;

-- 5. Seed logic for existing users
do $$
declare
  free_plan_id uuid;
  user_record record;
  new_sub_id uuid;
  user_workspaces_count integer;
  has_key_col boolean;
begin
  -- Check if 'key' column exists in public.plans
  select exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'plans' and column_name = 'key'
  ) into has_key_col;

  -- Get the free plan ID dynamically to avoid compilation errors
  if has_key_col then
    execute 'select id from public.plans where key = ''free'' limit 1' into free_plan_id;
  else
    execute 'select id from public.plans where name ilike ''%free%'' limit 1' into free_plan_id;
  end if;

  if free_plan_id is null then
    raise notice 'Free plan not found in public.plans. Seeding skipped.';
    return;
  end if;

  -- Loop through all active users in auth.users
  for user_record in select id from auth.users loop
    -- Check if subscription already exists
    if not exists (select 1 from public.subscriptions where user_id = user_record.id and status in ('active', 'trialing')) then
      
      -- Insert subscription
      insert into public.subscriptions (user_id, plan_id, status, current_period_start)
      values (user_record.id, free_plan_id, 'active', now())
      returning id into new_sub_id;

      -- Calculate active workspaces owned by the user
      user_workspaces_count := 0;
      
      begin
        execute 'select count(*) from public.workspaces where created_by = $1' 
        using user_record.id 
        into user_workspaces_count;
      exception
        when undefined_table then
          user_workspaces_count := 0;
        when undefined_column then
          user_workspaces_count := 0;
      end;

      -- Insert usage tracking record
      insert into public.subscription_usage (subscription_id, user_id, workspaces_count)
      values (new_sub_id, user_record.id, user_workspaces_count);
      
    end if;
  end loop;
end;
$$;

-- 6. Ensure trigger for new users is updated (if handle_new_user exists, we modify it to insert usage)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  free_plan_id uuid;
  new_sub_id uuid;
  has_key_col boolean;
begin
  -- Dynamically get the free plan ID
  select exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'plans' and column_name = 'key'
  ) into has_key_col;

  if has_key_col then
    execute 'select id from public.plans where key = ''free'' limit 1' into free_plan_id;
  else
    execute 'select id from public.plans where name ilike ''%free%'' limit 1' into free_plan_id;
  end if;

  insert into public.profiles (id, display_name, email, hqid)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email,
    lower(replace(coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), ' ', '-'))
      || '-' || substr(new.id::text, 1, 4)
  );

  if free_plan_id is not null then
    insert into public.subscriptions (user_id, plan_id, status, current_period_start)
    values (new.id, free_plan_id, 'active', now())
    returning id into new_sub_id;

    insert into public.subscription_usage (subscription_id, user_id, workspaces_count)
    values (new_sub_id, new.id, 0);
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = '';
