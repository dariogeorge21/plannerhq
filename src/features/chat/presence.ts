import { RealtimeChannel } from "@supabase/supabase-js";
import { ChatPresenceState } from "./types";

/**
 * Tracks the current user's presence on the given realtime channel.
 */
export async function trackUserPresence(
  channel: RealtimeChannel,
  profile: { id: string; display_name: string; avatar_url: string | null; hqid: string }
) {
  return await channel.track({
    user_id: profile.id,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
    hqid: profile.hqid,
    online_at: new Date().toISOString(),
  });
}

/**
 * Subscribes to presence sync events and calls the callback with the unique online users.
 */
export function setupPresenceListener(
  channel: RealtimeChannel,
  onSync: (users: ChatPresenceState[]) => void
) {
  channel.on("presence", { event: "sync" }, () => {
    const state = channel.presenceState();
    const users: ChatPresenceState[] = [];

    for (const id in state) {
      const presences = state[id] as any[];
      if (presences.length > 0) {
        users.push(presences[0] as ChatPresenceState);
      }
    }

    // Filter to ensure unique users by user_id
    const uniqueUsers = Array.from(
      new Map(users.map((u) => [u.user_id, u])).values()
    );

    onSync(uniqueUsers);
  });
}

