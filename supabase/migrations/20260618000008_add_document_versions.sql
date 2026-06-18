-- Migration: Add Document Versions & Update Document Content
-- Date: 2026-06-18

-- 1. Alter document_content to use BYTEA for Yjs state
-- We drop the JSONB column and add a BYTEA column.
ALTER TABLE public.document_content DROP COLUMN IF EXISTS content;
ALTER TABLE public.document_content ADD COLUMN content BYTEA;

-- 2. Create document_versions table
CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT,
  content BYTEA NOT NULL,
  content_json JSONB,
  byte_size INTEGER,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  label TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes for document_versions
CREATE UNIQUE INDEX IF NOT EXISTS idx_doc_versions_unique_number ON public.document_versions(document_id, version_number);
CREATE INDEX IF NOT EXISTS idx_doc_versions_doc_created ON public.document_versions(document_id, created_at);
CREATE INDEX IF NOT EXISTS idx_doc_versions_created_at ON public.document_versions(created_at);

-- 4. Enable RLS on document_versions
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for document_versions
CREATE POLICY "Users can view versions in their workspaces"
  ON public.document_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_versions.document_id
      AND public.is_workspace_member(d.workspace_id)
    )
  );

CREATE POLICY "Users can create versions in their workspaces"
  ON public.document_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_versions.document_id
      AND public.is_workspace_member(d.workspace_id)
    )
  );

CREATE POLICY "Users can soft-delete versions in their workspaces"
  ON public.document_versions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_versions.document_id
      AND public.is_workspace_member(d.workspace_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_versions.document_id
      AND public.is_workspace_member(d.workspace_id)
    )
  );

CREATE POLICY "Admins can hard-delete versions in their workspaces"
  ON public.document_versions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_versions.document_id
      AND public.has_workspace_role(d.workspace_id, ARRAY['owner', 'admin'])
    )
  );

-- 6. Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_versions TO authenticated;

-- 7. Automated Versioning Trigger (debounced snapshot is best done in code, 
-- but here we ensure no direct DB trigger is doing it for every keystroke, 
-- as requested, we'll handle creation via the application logic.)

-- 8. Cron job for retention (concept)
-- Assume `plans` or `workspace_subscriptions` logic will manage this via pg_cron or edge functions.
-- For now, an example function to clean up old versions:
CREATE OR REPLACE FUNCTION public.cleanup_old_document_versions()
RETURNS void AS $$
BEGIN
  -- Default cleanup of soft-deleted after 30 days
  DELETE FROM public.document_versions
  WHERE is_deleted = true AND created_at < NOW() - INTERVAL '30 days';
  
  -- Can be extended to check workspace plans for retention limits
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
