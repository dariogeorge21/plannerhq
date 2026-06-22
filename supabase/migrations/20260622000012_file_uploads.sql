-- Migration: Create File Uploads Table & Storage Bucket
-- Date: 2026-06-22

-- 1. Create storage bucket for workspace files
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'workspace-files',
  'workspace-files',
  false,
  null,
  null
) on conflict (id) do update set
  public = false;

-- 2. Create Storage Policies
-- SELECT: Users can read files in their workspaces. Storage path is typically: {workspace_id}/{entity_type}/{entity_id}/{file_name}
create policy "Users can read workspace files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'workspace-files'
    and public.is_workspace_member((storage.foldername(name))[1]::uuid)
  );

-- INSERT: Users can upload files to their workspaces
create policy "Users can upload workspace files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'workspace-files'
    and public.is_workspace_member((storage.foldername(name))[1]::uuid)
  );

-- DELETE: Users can delete files in their workspaces
create policy "Users can delete workspace files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'workspace-files'
    and public.is_workspace_member((storage.foldername(name))[1]::uuid)
  );

-- 3. Add storage_used column to workspaces
alter table public.workspaces add column if not exists storage_used bigint not null default 0;

-- 4. Create public.file_uploads table
create table if not exists public.file_uploads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  entity_type text not null check (entity_type in ('workspace', 'document', 'task')),
  entity_id uuid not null,
  storage_path text not null,
  file_name text not null,
  file_size bigint not null default 0,
  mime_type text not null,
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Indexes
create index if not exists file_uploads_workspace_id_idx on public.file_uploads (workspace_id);
create index if not exists file_uploads_entity_idx on public.file_uploads (entity_type, entity_id);
create index if not exists file_uploads_uploaded_by_idx on public.file_uploads (uploaded_by);

-- 6. Updated_at trigger
drop trigger if exists set_file_uploads_updated_at on public.file_uploads;
create trigger set_file_uploads_updated_at before update on public.file_uploads
  for each row execute function public.handle_updated_at();

-- 7. Trigger to update workspaces.storage_used
create or replace function public.update_workspace_storage_used()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.workspaces
    set storage_used = storage_used + new.file_size
    where id = new.workspace_id;
  elsif (TG_OP = 'DELETE') then
    update public.workspaces
    set storage_used = storage_used - old.file_size
    where id = old.workspace_id;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = '';

drop trigger if exists on_file_upload_insert_delete on public.file_uploads;
create trigger on_file_upload_insert_delete
  after insert or delete on public.file_uploads
  for each row execute function public.update_workspace_storage_used();

-- 8. Enable RLS
alter table public.file_uploads enable row level security;

-- 9. RLS Policies for file_uploads
create policy "Users can view workspace file records"
  on public.file_uploads for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "Users can insert workspace file records"
  on public.file_uploads for insert
  to authenticated
  with check (
    public.is_workspace_member(workspace_id)
    and uploaded_by = auth.uid()
  );

create policy "Users can delete workspace file records"
  on public.file_uploads for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));

-- 10. Grants
grant select, insert, delete on public.file_uploads to authenticated;
