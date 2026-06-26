export interface ChannelMessageWithUser {
  id: string;
  workspace_id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    name?: string;
    avatar?: string;
  } | null;
}

export interface Channel {
  id: string;
  name: string;
  description?: string | null;
  workspace_id: string;
  created_by: string;
  slug: string;
  is_direct: boolean;
  is_private: boolean;
  updated_at: string;
  created_at: string;
}

export interface ChatPresenceState {
  user_id: string;
  display_name: string;
  avatar_url?: string | null;
  hqid?: string;
  online_at?: string;
  typing?: boolean;
}