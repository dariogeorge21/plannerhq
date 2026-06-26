"use server";

import { createClient } from "@/lib/supabase/server";
import { Channel } from "./types";
import { GetWorkspaceMembers } from "../workspace/workspace";

export async function CreateChannelForWorkspace(workspaceId: string, name: string, description?: string, isPrivate: boolean = false, memberIds: string[] = []): Promise<Channel> {
  const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify the user is an admin or owner of the workspace
  const { data: memberData, error: memberError } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();

  if (memberError || !memberData || (memberData.role !== 'admin' && memberData.role !== 'owner')) {
    throw new Error("Only workspace admins or owners can create channels.");
  }

  const channelId = crypto.randomUUID();

  const { error } = await supabase
    .from('chat_channels')
    .insert({
      id: channelId,
      workspace_id: workspaceId,
      slug,
      name,
      description: description || null,
      created_by: user.id,
      is_private: isPrivate,
    });

  if (error) {
    throw new Error("Failed to create channel: " + error.message);
  }

  if (isPrivate) {
    // Add the creator and any specified members to chat_channel_members
    const membersToInsert = Array.from(new Set([...memberIds, user.id])).map(id => ({
      channel_id: channelId,
      user_id: id
    }));
    const { error: membersError } = await supabase
      .from('chat_channel_members')
      .insert(membersToInsert);

    if (membersError) {
      console.error("Failed to add members to private channel:", membersError);
    }
  }

  return {
    id: channelId,
    workspace_id: workspaceId,
    slug,
    name,
    description: description || null,
    created_by: user.id,
    is_private: isPrivate,
    is_direct: false,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  } as Channel;
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify the user is an admin or owner of the workspace
  const { data: memberData } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();

  if (!memberData || (memberData.role !== 'admin' && memberData.role !== 'owner')) {
    throw new Error("Only workspace admins or owners can delete channels.");
  }

  // Prevent deleting the general channel
  const { data: channelData } = await supabase
    .from('chat_channels')
    .select('slug')
    .eq('id', channelId)
    .single();

  if (channelData?.slug === 'general') {
    throw new Error("The general channel cannot be deleted.");
  }

  const { error } = await supabase
    .from('chat_channels')
    .delete()
    .eq('id', channelId)
    .eq('workspace_id', workspaceId);

  if (error) throw error;
  return { id: channelId } as Channel;
}

export async function UpdateChannelMembers(workspaceId: string, channelId: string, addedMemberIds: string[], removedMemberIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify the user is an admin or owner
  const { data: memberData } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();

  if (!memberData || (memberData.role !== 'admin' && memberData.role !== 'owner')) {
    throw new Error("Only workspace admins or owners can modify channel members.");
  }

  // Remove members
  if (removedMemberIds.length > 0) {
    // Prevent removing the creator/current admin from their own private channel? 
    // We'll just execute it.
    await supabase
      .from('chat_channel_members')
      .delete()
      .eq('channel_id', channelId)
      .in('user_id', removedMemberIds);
  }

  // Add members
  if (addedMemberIds.length > 0) {
    const membersToInsert = addedMemberIds.map(id => ({
      channel_id: channelId,
      user_id: id
    }));
    await supabase
      .from('chat_channel_members')
      .insert(membersToInsert);
  }

  return { success: true };
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