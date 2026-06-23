export type WorkspaceRole = 'owner' | 'admin' | 'member';
export type InviteStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  created_by: string;
  role?: WorkspaceRole; // Joined role for current user
  joined_at?: string;    // Joined timestamp for current user
}

export interface WorkspaceMember {
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
  display_name: string;
  email: string;
  hqid: string;
  avatar_url: string | null;
}

export interface WorkspaceInvite {
  id: string;
  workspace_id: string;
  inviter_id: string;
  invitee_hqid: string;
  invitee_id: string | null;
  status: InviteStatus;
  created_at: string;
  expires_at: string;
  role: WorkspaceRole;
  invitee_email: string | null;
}

export interface WorkspaceActivityLog {
  id: string;
  workspace_id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  metadata: any;
  created_at: string;
  profiles?: {
    display_name: string;
    avatar_url: string | null;
    email: string;
  };
}
