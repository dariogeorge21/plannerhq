-- Migration for Document Enhancements: Favorites and Activity

-- 1. Document Favorites
CREATE TABLE IF NOT EXISTS public.favorite_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, document_id)
);

ALTER TABLE public.favorite_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites"
  ON public.favorite_documents
  FOR ALL
  USING (auth.uid() = user_id);

-- 2. Document Activity (Recently Viewed)
CREATE TABLE IF NOT EXISTS public.user_document_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  view_count INTEGER DEFAULT 1 NOT NULL,
  UNIQUE(user_id, document_id)
);

ALTER TABLE public.user_document_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own activity"
  ON public.user_document_activity
  FOR ALL
  USING (auth.uid() = user_id);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_favorite_documents_user_workspace ON public.favorite_documents(user_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_user_document_activity_user_workspace ON public.user_document_activity(user_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_user_document_activity_last_viewed ON public.user_document_activity(last_viewed_at DESC);
