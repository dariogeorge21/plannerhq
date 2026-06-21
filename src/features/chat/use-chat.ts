import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { ViewMessagesForChannel, SendMessageForChannel } from "./chat";
import { ViewChannels, GetOrCreateDirectChannel } from "./channel";
import { GetWorkspaceMembers } from "../workspace/workspace";
import { setupPresenceListener, trackUserPresence } from "./presence";
import { Channel, ChannelMessageWithUser, ChatPresenceState } from "./types";

export function useChat(workspaceId: string, customChannelId?: string) {
  const supabase = createClient();

  const [activeChannelId, setActiveChannelId] = useState<string | null>(customChannelId || null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<ChannelMessageWithUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatPresenceState[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({}); // userId -> displayName
  const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentUserRef = useRef<{ id: string; display_name: string; hqid: string; avatar_url: string | null } | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch user profile and resolve channel ID
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        // Fetch current user and profile
        const { data: authData } = await supabase.auth.getUser();
        if (authData.user) {
          setCurrentUserId(authData.user.id);
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (profile) {
            currentUserRef.current = {
              id: profile.id,
              display_name: profile.display_name,
              hqid: profile.hqid,
              avatar_url: profile.avatar_url,
            };
          }
        }

        // Resolve active channel ID if not passed
        const channelsData = await ViewChannels(workspaceId);
        setChannels(channelsData);

        const membersResponse = await GetWorkspaceMembers(workspaceId);
        if (membersResponse.success && membersResponse.data) {
          setWorkspaceMembers(membersResponse.data);
        }

        if (!customChannelId) {
          const generalChannel = channelsData.find(c => c.slug === 'general' && !c.is_direct) || channelsData.find(c => !c.is_direct) || channelsData[0];
          if (generalChannel) {
            setActiveChannelId(generalChannel.id);
          }
        } else {
          setActiveChannelId(customChannelId);
        }
      } catch (err) {
        console.error("Error initializing chat profile/channels:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [workspaceId, customChannelId]);

  // 2. Load messages and setup Realtime subscription when channel ID resolves
  useEffect(() => {
    const channelId = activeChannelId;
    if (!channelId || !workspaceId) return;

    let isSubscribed = true;

    async function loadInitialMessages(cid: string) {
      try {
        setLoading(true);
        const { messages: initialMsgs } = await ViewMessagesForChannel(workspaceId, cid);
        if (isSubscribed) {
          setMessages(initialMsgs);
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error loading chat messages:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }

    loadInitialMessages(channelId);

    // Create Realtime channel
    const rtChannel = supabase.channel(`workspace-chat:${channelId}`, {
      config: {
        presence: {
          key: currentUserRef.current?.id || 'unknown',
        },
      },
    });

    // Handle incoming new messages
    rtChannel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `channel_id=eq.${activeChannelId}`,
      },
      async (payload) => {
        const newMsg = payload.new as any;

        // Fetch user profile details for the new message
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .eq("id", newMsg.user_id)
          .single();

        const messageWithUser: ChannelMessageWithUser = {
          ...newMsg,
          user: profile ? {
            id: profile.id,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
          } : null,
        };

        if (isSubscribed) {
          setMessages((prev) => {
            if (prev.some(m => m.id === messageWithUser.id)) return prev;
            return [...prev, messageWithUser];
          });
        }
      }
    );

    // Setup presence listener using presence.ts functions
    setupPresenceListener(rtChannel, (users) => {
      if (isSubscribed) {
        setOnlineUsers(users);
      }
    });

    // Setup typing broadcast listener
    rtChannel.on("broadcast", { event: "typing" }, (payload) => {
      const p = payload.payload as { user_id: string; display_name: string; typing: boolean };
      if (p.user_id === currentUserRef.current?.id) return;

      if (isSubscribed) {
        setTypingUsers((prev) => {
          const newMap = { ...prev };
          if (p.typing) {
            newMap[p.user_id] = p.display_name;
          } else {
            delete newMap[p.user_id];
          }
          return newMap;
        });
      }
    });

    // Subscribe to channel and track presence
    rtChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED" && currentUserRef.current && isSubscribed) {
        await trackUserPresence(rtChannel, currentUserRef.current);
      }
    });

    channelRef.current = rtChannel;

    return () => {
      isSubscribed = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [activeChannelId, workspaceId]);

  // Load more placeholder
  const loadMore = useCallback(async () => { }, []);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!activeChannelId || !content.trim()) return;
    try {
      await SendMessageForChannel(workspaceId, activeChannelId, content);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }, [activeChannelId, workspaceId]);

  // Emit typing indicator
  const setTyping = useCallback(() => {
    if (!channelRef.current || !currentUserRef.current) return;

    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: {
        user_id: currentUserRef.current.id,
        display_name: currentUserRef.current.display_name,
        typing: true,
      },
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (channelRef.current && currentUserRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "typing",
          payload: {
            user_id: currentUserRef.current.id,
            display_name: currentUserRef.current.display_name,
            typing: false,
          },
        });
      }
    }, 3000);
  }, []);

  const startDirectChat = useCallback(async (memberId: string) => {
    try {
      setLoading(true);
      const channel = await GetOrCreateDirectChannel(workspaceId, memberId);
      // Ensure it's in our channels list
      setChannels(prev => {
        if (!prev.find(c => c.id === channel.id)) {
          return [...prev, channel];
        }
        return prev;
      });
      setActiveChannelId(channel.id);
    } catch (err) {
      console.error("Failed to start direct chat:", err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  return {
    channels,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    hasMore,
    loadingMore,
    loadMore,
    sendMessage,
    setTyping,
    currentUserId,
    activeChannelId,
    setActiveChannelId,
    workspaceMembers,
    startDirectChat,
  };
}