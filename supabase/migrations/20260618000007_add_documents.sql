-- Migration: Add Documents & Sections
-- Date: 2026-06-18

-- 1. Create sections table
CREATE TABLE IF NOT EXISTS public.document_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.document_sections(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  position INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  cover TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create document_content table (1:1 with documents for performance)
CREATE TABLE IF NOT EXISTS public.document_content (
  document_id UUID PRIMARY KEY REFERENCES public.documents(id) ON DELETE CASCADE,
  content JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Triggers for updated_at
DROP TRIGGER IF EXISTS set_document_sections_updated_at ON public.document_sections;
CREATE TRIGGER set_document_sections_updated_at BEFORE UPDATE ON public.document_sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_documents_updated_at ON public.documents;
CREATE TRIGGER set_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_document_content_updated_at ON public.document_content;
CREATE TRIGGER set_document_content_updated_at BEFORE UPDATE ON public.document_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Enable RLS
ALTER TABLE public.document_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_content ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Sections
CREATE POLICY "Users can view document_section in their workspaces"
  ON public.document_sections FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Users can create document_section in their workspaces"
  ON public.document_section FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Users can update document_section in their workspaces"
  ON public.document_section FOR UPDATE
  TO authenticated
  USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Users can delete document_section in their workspaces"
  ON public.document_section FOR DELETE
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

-- Documents
CREATE POLICY "Users can view documents in their workspaces"
  ON public.documents FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Users can create documents in their workspaces"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Users can update documents in their workspaces"
  ON public.documents FOR UPDATE
  TO authenticated
  USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Users can delete documents in their workspaces"
  ON public.documents FOR DELETE
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

-- Document Content
CREATE POLICY "Users can view document content in their workspaces"
  ON public.document_content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_content.document_id
      AND public.is_workspace_member(d.workspace_id)
    )
  );

CREATE POLICY "Users can update document content in their workspaces"
  ON public.document_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_content.document_id
      AND public.is_workspace_member(d.workspace_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_content.document_id
      AND public.is_workspace_member(d.workspace_id)
    )
  );

-- 7. Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_sections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_content TO authenticated;

-- 8. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sections_workspace_id ON public.document_sections(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_section_id ON public.documents(section_id);
CREATE INDEX IF NOT EXISTS idx_documents_workspace_id ON public.documents(workspace_id);
