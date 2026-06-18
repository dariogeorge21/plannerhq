import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { createDocumentService } from "./services";
import {
  createSectionAction,
  updateSectionAction,
  deleteSectionAction,
  reorderSectionsAction,
  createDocumentAction,
  updateDocumentAction,
  deleteDocumentAction,
  reorderDocumentsAction,
  saveDocumentContentAction,
} from "./actions";

export function useSections(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["sections", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const supabase = createClient();
      const service = createDocumentService(supabase);
      return service.getSections(workspaceId);
    },
    enabled: !!workspaceId,
  });
}

export function useDocuments(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["documents", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const supabase = createClient();
      const service = createDocumentService(supabase);
      return service.getDocuments(workspaceId);
    },
    enabled: !!workspaceId,
  });
}

export function useDocument(documentId: string | undefined) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const supabase = createClient();
      const service = createDocumentService(supabase);
      return service.getDocument(documentId);
    },
    enabled: !!documentId,
  });
}

export function useDocumentContent(documentId: string | undefined) {
  return useQuery({
    queryKey: ["document_content", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const supabase = createClient();
      const service = createDocumentService(supabase);
      return service.getDocumentContent(documentId);
    },
    enabled: !!documentId,
  });
}

export function useCreateSection(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createSectionAction({ workspaceId, name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sections", workspaceId] }),
  });
}

export function useCreateDocument(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sectionId: string; title: string }) =>
      createDocumentAction({ workspaceId, sectionId: data.sectionId, title: data.title }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] }),
  });
}

export function useUpdateDocument(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { documentId: string; title?: string; icon?: string | null; cover?: string | null; sectionId?: string }) =>
      updateDocumentAction(data, workspaceId),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["document", vars.documentId] });
    },
  });
}

export function useSaveDocumentContent(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { documentId: string; content: any }) =>
      saveDocumentContentAction(data, workspaceId),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["document_content", vars.documentId] });
    },
  });
}
