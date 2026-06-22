import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { GetWorkspace } from "./workspace";
import { Workspace } from "@/types/workspace";

export function useWorkspace() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string | undefined;

  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      const res = await GetWorkspace(workspaceId);
      if (res.success && res.data) {
        return res.data as Workspace;
      }
      throw new Error(res.message || "Failed to fetch workspace");
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWorkspaceMembers() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string | undefined;

  return useQuery({
    queryKey: ["workspace_members", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const res = await import("./workspace").then(m => m.GetWorkspaceMembers(workspaceId));
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}
