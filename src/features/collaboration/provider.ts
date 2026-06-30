import * as Y from "yjs";
import { SupabaseProvider } from "@supabase-labs/y-supabase";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { createAwarenessUser } from "./awareness";
import { AwarenessState } from "./types";

export function useCollaborationProvider(documentId: string, workspaceId: string) {
  // Use useMemo to ensure we only create the client once
  const supabase = useMemo(() => createClient(), []);
  
  const [provider, setProvider] = useState<SupabaseProvider | null>(null);
  // Y.Doc should also be created once per document
  const [doc] = useState(() => new Y.Doc());
  const [isConnected, setIsConnected] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [activeUsers, setActiveUsers] = useState<AwarenessState[]>([]);

  useEffect(() => {
    if (!documentId || !workspaceId) return;

    const room = `doc:${workspaceId}:${documentId}`;
    
    const p = new SupabaseProvider(room, doc, supabase, {
      awareness: true,
      persistence: {
        table: "yjs_document_state",
        roomColumn: "room",
        stateColumn: "state",
      },
    });

    const handleConnect = () => {
      setIsConnected(true);
      setIsOffline(false);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsOffline(true);
    };

    p.on("status", (status) => {
      if (status === "connected") handleConnect();
      else if (status === "disconnected") handleDisconnect();
    });

    p.on("connect", handleConnect);
    p.on("disconnect", handleDisconnect);

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const userAwareness = createAwarenessUser(data.user);
        const awareness = p.getAwareness();
        if (awareness) {
          awareness.setLocalStateField("user", userAwareness);
        }
      }
    });

    const awareness = p.getAwareness();
    if (awareness) {
      awareness.on("change", () => {
        const states = awareness.getStates();
        const users: AwarenessState[] = [];
        states.forEach((state: any, clientId: number) => {
          if (state.user) {
            users.push({ ...state, clientId });
          }
        });
        setActiveUsers(users);
      });
    }

    const persistence = p.getPersistence();
    if (persistence) {
      if (persistence.synced) {
        setIsSynced(true);
      } else {
        persistence.on("synced", () => setIsSynced(true));
      }
    } else {
      setIsSynced(true);
    }

    setProvider(p);

    return () => {
      p.destroy();
    };
  }, [documentId, workspaceId, supabase, doc]);

  return { provider, doc, isConnected, isSynced, isOffline, activeUsers, awareness: provider?.getAwareness() };
}
