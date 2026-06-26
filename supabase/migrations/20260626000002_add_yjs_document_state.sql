CREATE TABLE IF NOT EXISTS public.yjs_document_state (
  room       TEXT PRIMARY KEY,
  state      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.yjs_document_state ENABLE ROW LEVEL SECURITY;

-- Workspace members can read/write Yjs state for their documents
CREATE POLICY "workspace_members_can_manage_yjs_state"
ON public.yjs_document_state
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.workspace_members wm ON wm.workspace_id = d.workspace_id
    WHERE d.id = NULLIF(split_part(room, ':', 3), '')::uuid
      AND wm.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.workspace_members wm ON wm.workspace_id = d.workspace_id
    WHERE d.id = NULLIF(split_part(room, ':', 3), '')::uuid
      AND wm.user_id = (SELECT auth.uid())
  )
);

-- Delete any existing un-parseable JSON content to prevent the migration from failing
DELETE FROM public.document_content WHERE content IS NOT NULL AND encode(content, 'escape') NOT LIKE '{%';

ALTER TABLE public.document_content 
  ALTER COLUMN content TYPE jsonb 
  USING encode(content, 'escape')::jsonb;
