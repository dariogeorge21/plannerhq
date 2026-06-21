-- 1. Add is_direct column to chat_channels
ALTER TABLE public.chat_channels ADD COLUMN is_direct BOOLEAN NOT NULL DEFAULT false;

-- 2. Create chat_channel_members table for private channels
CREATE TABLE public.chat_channel_members (
  channel_id UUID NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (channel_id, user_id)
);

-- Indexes for performance
CREATE INDEX chat_channel_members_user_idx ON public.chat_channel_members(user_id);

-- Enable RLS
ALTER TABLE public.chat_channel_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_channel_members
CREATE POLICY "Users can view their channel memberships"
ON public.chat_channel_members FOR SELECT
USING (
  user_id = auth.uid() OR
  channel_id IN (
    SELECT channel_id FROM public.chat_channel_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "System can insert channel members"
ON public.chat_channel_members FOR INSERT
WITH CHECK (
  true -- Actually, we'll use SECURITY DEFINER functions to manage this securely
);

-- Update RLS Policies for chat_channels to handle direct messages
DROP POLICY IF EXISTS "Users can view channels in their workspaces" ON public.chat_channels;
CREATE POLICY "Users can view channels in their workspaces"
ON public.chat_channels FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
  AND (
    is_direct = false OR 
    id IN (SELECT channel_id FROM public.chat_channel_members WHERE user_id = auth.uid())
  )
);

-- Update RLS Policies for chat_messages to handle direct messages
DROP POLICY IF EXISTS "Users can view messages in their workspaces" ON public.chat_messages;
CREATE POLICY "Users can view messages in their workspaces"
ON public.chat_messages FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
  AND (
    channel_id IN (SELECT id FROM public.chat_channels WHERE is_direct = false) OR
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
    channel_id IN (SELECT id FROM public.chat_channels WHERE is_direct = false) OR
    channel_id IN (SELECT channel_id FROM public.chat_channel_members WHERE user_id = auth.uid())
  )
);

-- Function to get or create a direct channel safely
CREATE OR REPLACE FUNCTION get_or_create_direct_channel(
  p_workspace_id UUID,
  p_user1_id UUID,
  p_user2_id UUID
) RETURNS UUID AS $$
DECLARE
  v_channel_id UUID;
  v_slug TEXT;
  v_user1_profile RECORD;
  v_user2_profile RECORD;
BEGIN
  -- Validate users are in workspace
  IF NOT EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = p_workspace_id AND user_id = p_user1_id) THEN
    RAISE EXCEPTION 'User 1 is not in workspace';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = p_workspace_id AND user_id = p_user2_id) THEN
    RAISE EXCEPTION 'User 2 is not in workspace';
  END IF;

  -- Ensure consistent ordering for slug to prevent duplicates
  IF p_user1_id < p_user2_id THEN
    v_slug := 'direct_' || p_user1_id || '_' || p_user2_id;
  ELSE
    v_slug := 'direct_' || p_user2_id || '_' || p_user1_id;
  END IF;

  -- Check if channel already exists
  SELECT id INTO v_channel_id FROM chat_channels 
  WHERE workspace_id = p_workspace_id AND slug = v_slug AND is_direct = true;

  IF v_channel_id IS NOT NULL THEN
    RETURN v_channel_id;
  END IF;

  -- Create new direct channel
  INSERT INTO chat_channels (workspace_id, name, description, slug, created_by, is_direct)
  VALUES (
    p_workspace_id, 
    'Direct Message', 
    'Direct Message', 
    v_slug, 
    p_user1_id, 
    true
  )
  RETURNING id INTO v_channel_id;

  -- Add members
  INSERT INTO chat_channel_members (channel_id, user_id)
  VALUES (v_channel_id, p_user1_id), (v_channel_id, p_user2_id);

  RETURN v_channel_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to create direct channels when a new user joins a workspace
CREATE OR REPLACE FUNCTION handle_new_workspace_member_direct_channels()
RETURNS TRIGGER AS $$
DECLARE
  v_existing_member RECORD;
BEGIN
  -- Loop through all existing members of the workspace
  FOR v_existing_member IN
    SELECT user_id FROM public.workspace_members 
    WHERE workspace_id = NEW.workspace_id AND user_id != NEW.user_id
  LOOP
    PERFORM public.get_or_create_direct_channel(NEW.workspace_id, NEW.user_id, v_existing_member.user_id);
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_workspace_member_added_direct_channels ON public.workspace_members;
CREATE TRIGGER on_workspace_member_added_direct_channels
  AFTER INSERT ON public.workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_workspace_member_direct_channels();
