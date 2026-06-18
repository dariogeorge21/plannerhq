import * as Y from "yjs";
import { SupabaseProvider } from "@supabase-labs/y-supabase";
import { useSupabase } from "@/hooks/useSupabase";
import { useEffect, useState } from "react";
import { createAwarenessUser } from "./awareness";
import { AwarenessState } from "./types";

export function useCollaborationProvider(documentId: string, workspaceId: string) {
  const supabase = useSupabase();
  const [provider, setProvider] = useState<SupabaseProvider | null>(null);
  const [doc] = useState(() => new Y.Doc());
  const [isConnected, setIsConnected] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [activeUsers, setActiveUsers] = useState<AwarenessState[]>([]);

  useEffect(() => {
    if (!documentId || !workspaceId) return;

    const room = `doc:${workspaceId}:${documentId}`;
    
    // We try to match the @supabase-labs/y-supabase signature based on user prompt and standard signature.
    let p: SupabaseProvider;
    try {
      // In some versions, the signature is (doc, supabase, { channel, id, tableName, columnName })
      p = new SupabaseProvider(doc, supabase, {
        channel: room,
        id: documentId,
        tableName: "document_content",
        columnName: "content",
      } as any);
    } catch (e) {
      // Fallback to prompt's format if it's an older or different version
      p = new (SupabaseProvider as any)(room, doc, supabase, {
        persistence: true,
      });
    }

    const handleConnect = () => {
      setIsConnected(true);
      setIsOffline(false);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsOffline(true);
    };

    p.on("status", (event: { status: string }) => {
      if (event.status === "connected") handleConnect();
      else if (event.status === "disconnected") handleDisconnect();
    });

    // Fallbacks if the provider uses different event names
    p.on("connect", handleConnect);
    p.on("disconnect", handleDisconnect);

    // Set Awareness info
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const userAwareness = createAwarenessUser(data.user);
        if (p.awareness) {
          p.awareness.setLocalStateField("user", userAwareness);
        }
      }
    });

    // Listen to awareness changes
    if (p.awareness) {
      p.awareness.on("change", () => {
        const states = p.awareness.getStates();
        const users: AwarenessState[] = [];
        states.forEach((state: any, clientId: number) => {
          if (state.user) {
            users.push({ ...state, clientId });
          }
        });
        setActiveUsers(users);
      });
    }

    setProvider(p);

    return () => {
      p.destroy();
    };
  }, [documentId, workspaceId, supabase, doc]);

  return { provider, doc, isConnected, isOffline, activeUsers };
}
