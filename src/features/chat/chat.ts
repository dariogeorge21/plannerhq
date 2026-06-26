"use server";

import { createClient } from "@/lib/supabase/server";
import { ChannelMessageWithUser } from "./types";

export async function ViewMessagesForChannel(workspaceId: string, channelId: string): Promise<{ messages: ChannelMessageWithUser[] }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*, user:profiles(id, display_name, avatar_url)')
    .eq('workspace_id', workspaceId)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return {
    messages: data as unknown as ChannelMessageWithUser[],
  };
}

export async function SendMessageForChannel(workspaceId: string, channelId: string, content: string): Promise<ChannelMessageWithUser> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      workspace_id: workspaceId,
      channel_id: channelId,
      user_id: user.id,
      content,
    })
    .select('*, user:profiles(id, display_name, avatar_url)')
    .single();

  if (error) throw error;

  return data as unknown as ChannelMessageWithUser;
}
