import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  listFilesAction, 
  uploadFileAction, 
  deleteFileAction, 
  getSignedUrlAction,
  getQuotaAction
} from "./actions";
import { FileFilters } from "./types";
import { toast } from "sonner";

export function useFiles(workspaceId: string | undefined, filters?: FileFilters) {
  return useQuery({
    queryKey: ["files", workspaceId, filters],
    queryFn: async () => {
      if (!workspaceId) return [];
      const res = await listFilesAction(workspaceId, filters);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!workspaceId,
  });
}

export function useWorkspaceQuota(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["quota", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      const res = await getQuotaAction(workspaceId);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!workspaceId,
  });
}

export function useUploadFile(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await uploadFileAction(formData);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      toast.success("File uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["files", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["quota", workspaceId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload file");
    }
  });
}

export function useDeleteFile(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (fileId: string) => {
      const res = await deleteFileAction(fileId, workspaceId);
      if (!res.success) throw new Error(res.error);
      return true;
    },
    onSuccess: () => {
      toast.success("File deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["files", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["quota", workspaceId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete file");
    }
  });
}

export function useSignedUrl(storagePath: string, download: boolean = false) {
  return useQuery({
    queryKey: ["signed_url", storagePath, download],
    queryFn: async () => {
      if (!storagePath) return null;
      const res = await getSignedUrlAction(storagePath, download);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!storagePath,
    staleTime: 50 * 60 * 1000, // 50 minutes (URL is valid for 1h)
  });
}
