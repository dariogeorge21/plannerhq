-- Allow admins and owners to DELETE chat_channels
CREATE POLICY "Admins and owners can delete channels"
ON public.chat_channels FOR DELETE
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
  )
);

-- Allow admins and owners to UPDATE chat_channels
CREATE POLICY "Admins and owners can update channels"
ON public.chat_channels FOR UPDATE
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
  )
);

-- Allow admins and owners to DELETE members from chat_channel_members
CREATE POLICY "Admins and owners can delete any member from channels"
ON public.chat_channel_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.chat_channels c
    JOIN public.workspace_members wm ON c.workspace_id = wm.workspace_id
    WHERE c.id = chat_channel_members.channel_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('admin', 'owner')
  )
);
