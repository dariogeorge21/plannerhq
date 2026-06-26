-- Custom ENUM for roles
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'rejected');

-- 1. Workspaces Table
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted boolean default false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- 2. Workspace Members Table
CREATE TABLE workspace_members (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role workspace_role DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (workspace_id, user_id)
);

-- 3. Workspace Invites Table
CREATE TABLE workspace_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    inviter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    invitee_hqid TEXT NOT NULL, -- The target user's HQID
    invitee_id UUID REFERENCES profiles(id), -- Resolved profile ID
    status invite_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);
ALTER TABLE workspace_invites add column role workspace_role DEFAULT 'member';
ALTER TABLE workspace_invites add column invitee_email TEXT;

CREATE OR REPLACE FUNCTION create_workspace_with_owner(
  workspace_name TEXT, 
  workspace_slug TEXT, 
  owner_id UUID
) RETURNS UUID AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Insert the workspace
  INSERT INTO workspaces (name, slug, created_by)
  VALUES (workspace_name, workspace_slug, owner_id)
  RETURNING id INTO new_workspace_id;

  -- Insert the owner into members
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, owner_id, 'owner');

  RETURN new_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE FUNCTION get_user_by_hqid(
  p_hqid TEXT
) RETURNS TABLE(
  id UUID,
  display_name TEXT,
  email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    profiles.id,
    profiles.display_name,
    profiles.email
  FROM 
    profiles
  WHERE 
    profiles.hqid = p_hqid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION get_user_by_email(
    p_email TEXT
) RETURNS TABLE(
    id UUID,
    display_name TEXT,
    email TEXT
) AS $$
BEGIN 
    RETURN QUERY
    SELECT 
        profiles.id,
        profiles.display_name,
        profiles.email
    FROM
        profiles
    WHERE
        profiles.email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION invite_user_to_workspace_by_hqid(
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
  SELECT id INTO invitee_id FROM profiles WHERE hqid = p_invitee_hqid;

  IF invitee_id IS NULL THEN
    RETURN NULL; -- User not found
  END IF;
  -- Insert the invite
  INSERT INTO workspace_invites (workspace_id, inviter_id, invitee_hqid, invitee_id,role)
  VALUES (p_workspace_id, p_inviter_id, p_invitee_hqid, invitee_id,p_role)
  RETURNING id INTO invite_id;

  RETURN invite_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION invite_user_to_workspace_by_email(
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
    SELECT id INTO invitee_id FROM profiles WHERE email = p_invitee_email;

    IF invitee_id IS NULL THEN
        RETURN NULL; -- User not found
    END IF;

    -- Insert the invite
    INSERT INTO workspace_invites (workspace_id, inviter_id, invitee_hqid, invitee_id,role)
    VALUES (p_workspace_id, p_inviter_id, (SELECT hqid FROM profiles WHERE id = invitee_id), invitee_id,p_role)
    RETURNING id INTO invite_id;

    RETURN invite_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION list_invitations_for_user(
  p_invitee_id UUID
) RETURNS TABLE(
  id UUID,
  workspace_id UUID,
  inviter_id UUID,
  invitee_hqid TEXT,
  invitee_id UUID,
  status invite_status,
  created_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    workspace_invites.id,
    workspace_invites.workspace_id,
    workspace_invites.inviter_id,
    workspace_invites.invitee_hqid,
    workspace_invites.invitee_id,
    workspace_invites.status,
    workspace_invites.created_at,
    workspace_invites.expires_at
  FROM 
    workspace_invites
  WHERE 
    workspace_invites.invitee_id = p_invitee_id AND workspace_invites.status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION accept_invitation(
  p_invitation_id UUID
) RETURNS UUID AS $$
DECLARE
  invite_id UUID;
BEGIN
  -- Update the invitation status to accepted
  UPDATE workspace_invites 
  SET status = 'accepted'
  WHERE id = p_invitation_id;
  
  -- Add the user to the workspace
  INSERT INTO workspace_members (workspace_id, user_id, role)
  SELECT workspace_id, invitee_id,
  FROM workspace_invites
  WHERE id = p_invitation_id;

  RETURN p_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;