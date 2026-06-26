"use server";

import { createClient } from "@/lib/supabase/server";
import { Channel } from "./types";
import { GetWorkspaceMembers } from "../workspace/workspace";

export async function CreateChannelForWorkspace(workspaceId: string, name: string, description?: string): Promise<Channel> {
  const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from('chat_channels')
    .insert({
      workspace_id: workspaceId,
      slug,
      name,
      description: description || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Failed to create channel: " + error.message);
  }
  return data as Channel;
}

export async function ViewChannels(workspaceId: string): Promise<Channel[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chat_channels')
    .select('*')
    .eq('workspace_id', workspaceId);
  if (error) throw error;
  return data as Channel[];
}

export async function DeleteChannel(channelId: string, workspaceId: string): Promise<Channel> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chat_channels')
    .delete()
    .eq('id', channelId)
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) throw error;
  return data as Channel;
}

export async function GetOrCreateDirectChannel(workspaceId: string, memberId: string): Promise<Channel> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase.rpc('get_or_create_direct_channel', {
    p_workspace_id: workspaceId,
    p_user1_id: user.id,
    p_user2_id: memberId
  });

  if (error) {
    throw new Error("Failed to get or create direct channel: " + error.message);
  }

  // data will contain the channel ID, fetch the full channel details
  const { data: channelData, error: channelError } = await supabase
    .from('chat_channels')
    .select('*')
    .eq('id', data)
    .single();

  if (channelError) {
    throw new Error("Failed to fetch direct channel: " + channelError.message);
  }

  return channelData as Channel;
}