-- Migration: Google OAuth Metadata Support in handle_new_user Trigger
-- Date: 2026-06-15

create or replace function public.handle_new_user()
returns trigger as $$
declare
  free_plan_id uuid;
  name_val text;
begin
  -- Retrieve the plan ID for the free plan
  select id into free_plan_id from public.plans where key = 'free';

  -- Extract display name from metadata (supporting standard email signup & Google OAuth metadata)
  name_val := coalesce(
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  -- Create the public profile record
  insert into public.profiles (id, display_name, email, hqid, avatar_url)
  values (
    new.id,
    name_val,
    new.email,
    lower(replace(name_val, ' ', '-')) || '-' || substr(new.id::text, 1, 4),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    email = excluded.email;

  -- Create free subscription record
  if free_plan_id is not null then
    insert into public.subscriptions (user_id, plan_id, status)
    values (new.id, free_plan_id, 'active')
    on conflict (user_id) where status in ('active', 'trialing') do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = '';
