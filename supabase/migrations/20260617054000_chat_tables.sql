-- 1. Create chat_channels table
create table public.chat_channels (
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid not null references public.workspaces(id) on delete cascade,
  name            text not null default 'General',
  description     text,
  slug            text UNIQUE NOT NULL,
  created_by      uuid not null references auth.users(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 2. Create chat_messages table
create table public.chat_messages (
  id              uuid primary key default gen_random_uuid(),
  channel_id      uuid not null references public.chat_channels(id) on delete cascade,
  workspace_id    uuid not null references public.workspaces(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  content         text not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Indexes for performance
create index chat_channels_workspace_idx on public.chat_channels(workspace_id);
create index chat_messages_channel_created_idx on public.chat_messages(channel_id, created_at desc);
create index chat_messages_workspace_idx on public.chat_messages(workspace_id);

-- Enable RLS
alter table public.chat_channels enable row level security;
alter table public.chat_messages enable row level security;

-- RLS Policies for chat_channels
create policy "Users can view channels in their workspaces"
on public.chat_channels for select
using (
  workspace_id in (
    select workspace_id from public.workspace_members where user_id = auth.uid()
  )
);

create policy "Workspace members can insert channels"
on public.chat_channels for insert
with check (
  workspace_id in (
    select workspace_id from public.workspace_members 
    where user_id = auth.uid()
  )
);

-- RLS Policies for chat_messages
create policy "Users can view messages in their workspaces"
on public.chat_messages for select
using (
  workspace_id in (
    select workspace_id from public.workspace_members where user_id = auth.uid()
  )
);

create policy "Users can insert messages in their workspaces"
on public.chat_messages for insert
with check (
  workspace_id in (
    select workspace_id from public.workspace_members where user_id = auth.uid()
  )
  and user_id = auth.uid()
);

-- Enable Realtime for chat_messages
alter publication supabase_realtime add table public.chat_messages;

-- modify the function create_workspace_with_owner

CREATE OR REPLACE FUNCTION create_workspace_with_owner(
  workspace_name TEXT, 
  workspace_slug TEXT, 
  owner_id UUID
) RETURNS UUID AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Insert the workspace
  INSERT INTO workspaces (name, slug, created_by)
  VALUES (workspace_name, workspace_slug, owner_id)
  RETURNING id INTO new_workspace_id;

  -- Insert the owner into members
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, owner_id, 'owner');

  -- create a general chat
  INSERT INTO chat_channels (workspace_id, name, description, created_by, slug)
  VALUES (new_workspace_id, 'General', 'Workspace General Chat', owner_id, 'general'); 

  RETURN new_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;