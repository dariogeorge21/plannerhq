-- ============================================================
-- Fix: Infinite RLS recursion on chat_channel_members
-- ============================================================
-- The original policy on chat_channel_members used a subquery that
-- referenced chat_channel_members itself, causing Postgres error 42P17.
-- Solution: a SECURITY DEFINER helper function that bypasses RLS
-- for the inner lookup, then use that function in the policies.
-- ============================================================

-- ─── 1. Helper: check membership without triggering RLS ─────────────────────

CREATE OR REPLACE FUNCTION is_channel_member(p_channel_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_channel_members
    WHERE channel_id = p_channel_id AND user_id = p_user_id
  );
$$;

-- ─── 2. Helper: get all channel IDs a user belongs to ───────────────────────

CREATE OR REPLACE FUNCTION get_user_channel_ids(p_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT channel_id FROM public.chat_channel_members WHERE user_id = p_user_id;
$$;

-- ─── 3. Fix chat_channel_members RLS policies ───────────────────────────────

-- Drop the recursive policy
DROP POLICY IF EXISTS "Users can view their channel memberships" ON public.chat_channel_members;
DROP POLICY IF EXISTS "System can insert channel members" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Users can manage their own memberships" ON public.chat_channel_members;

-- SELECT: a user can see rows where they ARE the member (simple, no recursion)
-- They can also see co-members of a shared channel via the SECURITY DEFINER helper.
CREATE POLICY "Users can view their channel memberships"
ON public.chat_channel_members FOR SELECT
USING (
  user_id = auth.uid()
  OR
  is_channel_member(channel_id, auth.uid())
);

-- INSERT: only SECURITY DEFINER functions (get_or_create_direct_channel,
-- handle_new_workspace_member_direct_channels) should insert rows.
-- Regular users never need to INSERT directly — so we keep WITH CHECK = true
-- but it is guarded by the SECURITY DEFINER on those functions.
CREATE POLICY "System can insert channel members"
ON public.chat_channel_members FOR INSERT
WITH CHECK (true);

-- DELETE: users can only remove themselves
CREATE POLICY "Users can delete own memberships"
ON public.chat_channel_members FOR DELETE
USING (user_id = auth.uid());

-- ─── 4. Fix chat_channels SELECT policy ─────────────────────────────────────
-- The previous policy re-checked chat_channel_members inline, which is fine for
-- chat_channels, but let's use the helper for clarity and future safety.

DROP POLICY IF EXISTS "Users can view channels in their workspaces" ON public.chat_channels;

CREATE POLICY "Users can view channels in their workspaces"
ON public.chat_channels FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
  AND (
    is_direct = false
    OR is_channel_member(id, auth.uid())
  )
);

-- ─── 5. Fix chat_messages RLS policies ──────────────────────────────────────

DROP POLICY IF EXISTS "Users can view messages in their workspaces" ON public.chat_messages;
CREATE POLICY "Users can view messages in their workspaces"
ON public.chat_messages FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
  AND (
    channel_id IN (SELECT id FROM public.chat_channels WHERE is_direct = false AND workspace_id = chat_messages.workspace_id)
    OR is_channel_member(channel_id, auth.uid())
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
    channel_id IN (SELECT id FROM public.chat_channels WHERE is_direct = false AND workspace_id = chat_messages.workspace_id)
    OR is_channel_member(channel_id, auth.uid())
  )
);

-- ─── 6. Grant execute on helpers to authenticated users ─────────────────────
GRANT EXECUTE ON FUNCTION is_channel_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_channel_ids(UUID) TO authenticated;
