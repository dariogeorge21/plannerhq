-- Add is_private column to chat_channels
ALTER TABLE public.chat_channels ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT false;

-- Update RLS Policies for chat_channels
DROP POLICY IF EXISTS "Users can view channels in their workspaces" ON public.chat_channels;
CREATE POLICY "Users can view channels in their workspaces"
ON public.chat_channels FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
  AND (
    (is_direct = false AND is_private = false) OR 
    id IN (SELECT channel_id FROM public.chat_channel_members WHERE user_id = auth.uid())
  )
);

-- Update RLS Policies for chat_messages to handle private channels
DROP POLICY IF EXISTS "Users can view messages in their workspaces" ON public.chat_messages;
CREATE POLICY "Users can view messages in their workspaces"
ON public.chat_messages FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
  AND (
    channel_id IN (SELECT id FROM public.chat_channels WHERE is_direct = false AND is_private = false) OR
    channel_id IN (SELECT channel_id FROM public.chat_channel_members WHERE user_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can insert messages in their workspaces" ON public.chat_messages;
CREATE POLICY "Users can insert messages in their workspaces"
ON public.chat_messages FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
  AND user_id = auth.uid()
  AND (
    channel_id IN (SELECT id FROM public.chat_channels WHERE is_direct = false AND is_private = false) OR
    channel_id IN (SELECT channel_id FROM public.chat_channel_members WHERE user_id = auth.uid())
  )
);
