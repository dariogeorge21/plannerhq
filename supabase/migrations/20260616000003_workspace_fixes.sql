-- Migration: Workspace Schema Fixes, RLS, and Grants
-- Date: 2026-06-16

-- 1. Drop existing functions with signature mismatches or bugs
DROP FUNCTION IF EXISTS public.create_workspace_with_owner(text, text, uuid);
DROP FUNCTION IF EXISTS public.invite_user_to_workspace_by_hqid(uuid, uuid, text, text);
DROP FUNCTION IF EXISTS public.invite_user_to_workspace_by_email(uuid, uuid, text, text);
DROP FUNCTION IF EXISTS public.accept_invitation(uuid);
DROP FUNCTION IF EXISTS public.decline_invitation(uuid);

-- 2. Re-create create_workspace_with_owner with correct parameter prefixes
CREATE OR REPLACE FUNCTION public.create_workspace_with_owner(
  p_workspace_name TEXT, 
  p_workspace_slug TEXT, 
  p_owner_id UUID
) RETURNS UUID AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Insert the workspace
  INSERT INTO public.workspaces (name, slug, created_by)
  VALUES (p_workspace_name, p_workspace_slug, p_owner_id)
  RETURNING id INTO new_workspace_id;

  -- Insert the owner into members
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, p_owner_id, 'owner');

  RETURN new_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-create invite_user_to_workspace_by_hqid with role casting
CREATE OR REPLACE FUNCTION public.invite_user_to_workspace_by_hqid(
  p_workspace_id UUID,
  p_inviter_id UUID,
  p_invitee_hqid TEXT,
  p_role TEXT
) RETURNS UUID AS $$
DECLARE
  invitee_id UUID;
  invite_id UUID;
BEGIN
  -- Resolve the invitee's ID from their HQID
  SELECT id INTO invitee_id FROM public.profiles WHERE hqid = p_invitee_hqid;

  IF invitee_id IS NULL THEN
    RETURN NULL; -- User not found
  END IF;

  -- Insert the invite
  INSERT INTO public.workspace_invites (workspace_id, inviter_id, invitee_hqid, invitee_id, role)
  VALUES (p_workspace_id, p_inviter_id, p_invitee_hqid, invitee_id, p_role::workspace_role)
  RETURNING id INTO invite_id;

  RETURN invite_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-create invite_user_to_workspace_by_email with email column insert and role casting
CREATE OR REPLACE FUNCTION public.invite_user_to_workspace_by_email(
  p_workspace_id UUID,
  p_inviter_id UUID,
  p_invitee_email TEXT,
  p_role TEXT
) RETURNS UUID AS $$
DECLARE
  invitee_id UUID;
  invite_id UUID;
BEGIN
  -- Resolve the invitee's ID from their email
  SELECT id INTO invitee_id FROM public.profiles WHERE email = p_invitee_email;

  IF invitee_id IS NULL THEN
    RETURN NULL; -- User not found
  END IF;

  -- Insert the invite
  INSERT INTO public.workspace_invites (workspace_id, inviter_id, invitee_hqid, invitee_id, role, invitee_email)
  VALUES (
    p_workspace_id, 
    p_inviter_id, 
    (SELECT hqid FROM public.profiles WHERE id = invitee_id), 
    invitee_id, 
    p_role::workspace_role, 
    p_invitee_email
  )
  RETURNING id INTO invite_id;

  RETURN invite_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Re-create accept_invitation with syntax fix (selecting role, removing trailing comma)
CREATE OR REPLACE FUNCTION public.accept_invitation(
  p_invitation_id UUID
) RETURNS UUID AS $$
DECLARE
  target_workspace_id UUID;
  target_invitee_id UUID;
  target_role workspace_role;
BEGIN
  -- Update the invitation status to accepted
  UPDATE public.workspace_invites 
  SET status = 'accepted'
  WHERE id = p_invitation_id
  RETURNING workspace_id, invitee_id, role INTO target_workspace_id, target_invitee_id, target_role;
  
  -- Add the user to the workspace members
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (target_workspace_id, target_invitee_id, target_role)
  ON CONFLICT (workspace_id, user_id) DO UPDATE 
  SET role = target_role;

  RETURN p_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create decline_invitation function
CREATE OR REPLACE FUNCTION public.decline_invitation(
  p_invitation_id UUID
) RETURNS UUID AS $$
BEGIN
  UPDATE public.workspace_invites 
  SET status = 'rejected'
  WHERE id = p_invitation_id;
  
  RETURN p_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Add updated_at column to workspaces table and attach trigger
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

DROP TRIGGER IF EXISTS set_updated_at ON public.workspaces;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invites ENABLE ROW LEVEL SECURITY;

-- 9. Setup RLS Policies

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners and admins can update workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete workspaces" ON public.workspaces;

DROP POLICY IF EXISTS "Members can view other members in the workspace" ON public.workspace_members;
DROP POLICY IF EXISTS "Admins and owners can add members" ON public.workspace_members;
DROP POLICY IF EXISTS "Admins and owners can update roles" ON public.workspace_members;
DROP POLICY IF EXISTS "Members can leave or admins can remove members" ON public.workspace_members;

DROP POLICY IF EXISTS "Users can view workspace invites" ON public.workspace_invites;
DROP POLICY IF EXISTS "Admins and owners can invite others" ON public.workspace_invites;
DROP POLICY IF EXISTS "Invitee or admins can update invites" ON public.workspace_invites;
DROP POLICY IF EXISTS "Admins and owners can delete invites" ON public.workspace_invites;

-- Workspaces Policies
-- Helper: is the current user a pending invitee of this workspace?
-- Needed so invitees can see the workspace name/description in their invitation banner.
CREATE OR REPLACE FUNCTION public.is_workspace_invitee(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_invites
    WHERE workspace_id = p_workspace_id
    AND invitee_id = (SELECT auth.uid())
    AND status = 'pending'
  );
$$;

-- Allow members AND pending invitees to see the workspace row.
-- Without this, PostgREST returns null for the workspaces join in invitation queries,
-- because the invitee is not yet a member and the old policy blocked the row.
CREATE POLICY "Users can view workspaces they are members of or invited to"
  ON public.workspaces FOR SELECT
  TO authenticated
  USING (
    public.is_workspace_member(id)
    OR public.is_workspace_invitee(id)
  );


CREATE POLICY "Users can create workspaces"
  ON public.workspaces FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Workspace owners and admins can update workspaces"
  ON public.workspaces FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Workspace owners can delete workspaces"
  ON public.workspaces FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'owner'
    )
  );

-- Workspace Members Policies
-- NOTE: Policies on workspace_members CANNOT self-join workspace_members — that causes
-- infinite recursion. Use SECURITY DEFINER helper functions to break the cycle.

-- Helper: is the current user a member of this workspace?
CREATE OR REPLACE FUNCTION public.is_workspace_member(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = p_workspace_id
    AND user_id = (SELECT auth.uid())
  );
$$;

-- Helper: is the current user an owner or admin of this workspace?
CREATE OR REPLACE FUNCTION public.is_workspace_admin(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = p_workspace_id
    AND user_id = (SELECT auth.uid())
    AND role IN ('owner', 'admin')
  );
$$;

CREATE POLICY "Members can view other members in the workspace"
  ON public.workspace_members FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins and owners can add members"
  ON public.workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_admin(workspace_id));

CREATE POLICY "Admins and owners can update roles"
  ON public.workspace_members FOR UPDATE
  TO authenticated
  USING (public.is_workspace_admin(workspace_id))
  WITH CHECK (public.is_workspace_admin(workspace_id));

CREATE POLICY "Members can leave or admins can remove members"
  ON public.workspace_members FOR DELETE
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR public.is_workspace_admin(workspace_id)
  );

-- Workspace Invites Policies
CREATE POLICY "Users can view workspace invites"
  ON public.workspace_invites FOR SELECT
  TO authenticated
  USING (
    invitee_id = auth.uid()
    OR inviter_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.workspace_members m
      WHERE m.workspace_id = workspace_invites.workspace_id
      AND m.user_id = auth.uid()
      AND m.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins and owners can invite others"
  ON public.workspace_invites FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members m
      WHERE m.workspace_id = workspace_invites.workspace_id
      AND m.user_id = auth.uid()
      AND m.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Invitee or admins can update invites"
  ON public.workspace_invites FOR UPDATE
  TO authenticated
  USING (
    invitee_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.workspace_members m
      WHERE m.workspace_id = workspace_invites.workspace_id
      AND m.user_id = auth.uid()
      AND m.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    invitee_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.workspace_members m
      WHERE m.workspace_id = workspace_invites.workspace_id
      AND m.user_id = auth.uid()
      AND m.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins and owners can delete invites"
  ON public.workspace_invites FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members m
      WHERE m.workspace_id = workspace_invites.workspace_id
      AND m.user_id = auth.uid()
      AND m.role IN ('owner', 'admin')
    )
  );

-- 10. Add missing FK: workspace_members.workspace_id → workspaces.id
-- This was missing from the initial migration and caused the PostgREST schema cache
-- to be unaware of the relationship, breaking embedded joins (workspaces!inner).
ALTER TABLE public.workspace_members
  DROP CONSTRAINT IF EXISTS workspace_members_workspace_id_fkey;
ALTER TABLE public.workspace_members
  ADD CONSTRAINT workspace_members_workspace_id_fkey
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

-- 11. Add missing FK: workspace_invites.workspace_id → workspaces(id)
-- Without this FK, PostgREST cannot resolve the workspaces relation in embedded selects.
ALTER TABLE public.workspace_invites
  DROP CONSTRAINT IF EXISTS workspace_invites_workspace_id_fkey;
ALTER TABLE public.workspace_invites
  ADD CONSTRAINT workspace_invites_workspace_id_fkey
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

-- 12. Safe RLS policies for workspace_invites
-- Uses is_workspace_admin() helper (SECURITY DEFINER) to avoid any cross-table recursion.
DROP POLICY IF EXISTS "Users can view workspace invites" ON public.workspace_invites;
DROP POLICY IF EXISTS "Admins and owners can invite others" ON public.workspace_invites;
DROP POLICY IF EXISTS "Invitee or admins can update invites" ON public.workspace_invites;
DROP POLICY IF EXISTS "Admins and owners can delete invites" ON public.workspace_invites;

CREATE POLICY "Users can view workspace invites"
  ON public.workspace_invites FOR SELECT
  TO authenticated
  USING (
    invitee_id = (SELECT auth.uid())
    OR inviter_id = (SELECT auth.uid())
    OR public.is_workspace_admin(workspace_id)
  );

CREATE POLICY "Admins and owners can invite others"
  ON public.workspace_invites FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_admin(workspace_id));

CREATE POLICY "Invitee or admins can update invites"
  ON public.workspace_invites FOR UPDATE
  TO authenticated
  USING (
    invitee_id = (SELECT auth.uid())
    OR public.is_workspace_admin(workspace_id)
  )
  WITH CHECK (
    invitee_id = (SELECT auth.uid())
    OR public.is_workspace_admin(workspace_id)
  );

CREATE POLICY "Admins and owners can delete invites"
  ON public.workspace_invites FOR DELETE
  TO authenticated
  USING (public.is_workspace_admin(workspace_id));

-- 13. Prevent duplicate pending invitations
-- One pending invite per (workspace, invitee) — regardless of whether the invite
-- was sent by email or hqid. The application resolves both to a profile UUID first.
DELETE FROM public.workspace_invites
WHERE id NOT IN (
  SELECT DISTINCT ON (workspace_id, invitee_id) id
  FROM public.workspace_invites
  WHERE status = 'pending'
  ORDER BY workspace_id, invitee_id, created_at DESC
);

CREATE UNIQUE INDEX IF NOT EXISTS workspace_invites_unique_pending
  ON public.workspace_invites (workspace_id, invitee_id)
  WHERE status = 'pending';

-- 14. Role Access Grants (Data API Exposure)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_invites TO authenticated;
