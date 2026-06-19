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
  const [isOffline, setIsOffline] = useState(false);
  const [activeUsers, setActiveUsers] = useState<AwarenessState[]>([]);

  useEffect(() => {
    if (!documentId || !workspaceId) return;

    const room = `doc:${workspaceId}:${documentId}`;
    
    let p: SupabaseProvider;
    try {
      p = new SupabaseProvider(doc, supabase, {
        channel: room,
        id: documentId,
        tableName: "document_content",
        columnName: "content",
      } as any);
    } catch (e) {
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

    p.on("connect", handleConnect);
    p.on("disconnect", handleDisconnect);

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const userAwareness = createAwarenessUser(data.user);
        if (p.awareness) {
          p.awareness.setLocalStateField("user", userAwareness);
        }
      }
    });

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
