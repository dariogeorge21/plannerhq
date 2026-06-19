-- Create task_sections table
create table public.task_sections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for task_sections
create index task_sections_workspace_id_idx on public.task_sections (workspace_id);
create index task_sections_sort_idx on public.task_sections (workspace_id, sort_order);

-- RLS for task_sections
alter table public.task_sections enable row level security;

create policy "Workspace members can view task_sections" on public.task_sections
  for select
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = task_sections.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Editor+ can create task_sections" on public.task_sections
  for insert
  with check (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = task_sections.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin', 'editor')
    )
  );

create policy "Editor+ can update task_sections" on public.task_sections
  for update
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = task_sections.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin', 'editor')
    )
  );

create policy "Admin+ can delete task_sections" on public.task_sections
  for delete
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = task_sections.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin')
    )
  );


-- Create tasks table
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  section_id uuid references public.task_sections(id) on delete set null,
  parent_id uuid references public.tasks(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done', 'blocked', 'cancelled')),
  priority text not null default 'none' check (priority in ('none', 'low', 'medium', 'high', 'urgent')),
  due_date timestamptz,
  sort_order integer not null default 0,
  completed boolean not null default false,
  viewed_by uuid[] not null default '{}',
  reviewed_by uuid[] not null default '{}',
  is_deleted boolean not null default false,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for tasks
create index tasks_workspace_id_idx on public.tasks (workspace_id);
create index tasks_section_id_idx on public.tasks (section_id);
create index tasks_parent_id_idx on public.tasks (parent_id);
create index tasks_status_idx on public.tasks (workspace_id, status);
create index tasks_due_date_idx on public.tasks (workspace_id, due_date) where due_date is not null;
create index tasks_created_by_idx on public.tasks (created_by);

-- RLS for tasks
alter table public.tasks enable row level security;

create policy "Workspace members can view tasks" on public.tasks
  for select
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Editor+ can create tasks" on public.tasks
  for insert
  with check (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin', 'editor')
    )
  );

create policy "Editor+ can update tasks" on public.tasks
  for update
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin', 'editor')
    )
  );

create policy "Admin+ can delete tasks" on public.tasks
  for delete
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin')
    )
  );


-- Create task_assignees table
create table public.task_assignees (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- Indexes for task_assignees
create unique index task_assignees_task_user_idx on public.task_assignees (task_id, user_id);
create index task_assignees_user_id_idx on public.task_assignees (user_id);

-- RLS for task_assignees
alter table public.task_assignees enable row level security;

-- A user can see task assignees if they can see the underlying task
create policy "Users can view task assignments if they can view the task" on public.task_assignees
  for select
  using (
    exists (
      select 1 from public.tasks
      join public.workspace_members on workspace_members.workspace_id = tasks.workspace_id
      where tasks.id = task_assignees.task_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Editor+ can create task assignments" on public.task_assignees
  for insert
  with check (
    exists (
      select 1 from public.tasks
      join public.workspace_members on workspace_members.workspace_id = tasks.workspace_id
      where tasks.id = task_assignees.task_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin', 'editor')
    )
  );

create policy "Editor+ can delete task assignments" on public.task_assignees
  for delete
  using (
    exists (
      select 1 from public.tasks
      join public.workspace_members on workspace_members.workspace_id = tasks.workspace_id
      where tasks.id = task_assignees.task_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin', 'editor')
    )
  );
