-- supabase/migrations/20260623000017_workspace_activity_logs.sql

-- Create an enum for common activity actions (optional, but good for consistency)
-- Alternatively, we can just use TEXT for flexibility. Let's use TEXT for flexibility but document expected values.

CREATE TABLE IF NOT EXISTS public.workspace_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- e.g., 'invited_user', 'changed_role', 'removed_user', 'joined_workspace'
    entity_type TEXT NOT NULL, -- e.g., 'user', 'task', 'document'
    entity_id UUID,            -- ID of the entity being acted upon (if applicable)
    metadata JSONB DEFAULT '{}'::jsonb, -- Additional context (e.g., {"new_role": "admin"})
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_workspace_activity_logs_workspace_id ON public.workspace_activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_activity_logs_user_id ON public.workspace_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_activity_logs_created_at ON public.workspace_activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.workspace_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view activity logs for workspaces they are members of
CREATE POLICY "Users can view activity logs for their workspaces"
    ON public.workspace_activity_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = workspace_activity_logs.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Only system/authenticated users acting through functions can insert
-- We allow insert if the user is a member of the workspace
CREATE POLICY "Users can insert activity logs for their workspaces"
    ON public.workspace_activity_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = workspace_activity_logs.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
        AND user_id = auth.uid() -- Can only log actions as themselves
    );

-- No update or delete policies (logs should be immutable)

-- Add comment
COMMENT ON TABLE public.workspace_activity_logs IS 'Tracks user activity and audit events within a workspace';
