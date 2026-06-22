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
    queryKey: ["document_sections", workspaceId],
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["document_sections", workspaceId] }),
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

export function useUpdateSection(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sectionId: string; name: string }) =>
      updateSectionAction(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["document_sections", workspaceId] }),
  });
}

export function useDeleteSection(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: string) => deleteSectionAction(sectionId, workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document_sections", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] });
    },
  });
}

export function useReorderSections(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: { id: string; position: number }[]) =>
      reorderSectionsAction(updates, workspaceId),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["document_sections", workspaceId] });
      const previousSections = queryClient.getQueryData<any[]>(["document_sections", workspaceId]);

      if (previousSections) {
        const updatedSections = previousSections.map((section) => {
          const update = updates.find((u) => u.id === section.id);
          return update ? { ...section, position: update.position } : section;
        }).sort((a, b) => a.position - b.position);

        queryClient.setQueryData(["document_sections", workspaceId], updatedSections);
      }
      return { previousSections };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousSections) {
        queryClient.setQueryData(["document_sections", workspaceId], context.previousSections);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["document_sections", workspaceId] });
    },
  });
}

export function useDeleteDocument(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => deleteDocumentAction(documentId, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] }),
  });
}

export function useReorderDocuments(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: { id: string; position: number; sectionId: string }[]) =>
      reorderDocumentsAction(updates, workspaceId),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["documents", workspaceId] });
      const previousDocuments = queryClient.getQueryData<any[]>(["documents", workspaceId]);

      if (previousDocuments) {
        const updatedDocuments = previousDocuments.map((doc) => {
          const update = updates.find((u) => u.id === doc.id);
          return update ? { ...doc, position: update.position, section_id: update.sectionId } : doc;
        }).sort((a, b) => a.position - b.position);

        queryClient.setQueryData(["documents", workspaceId], updatedDocuments);
      }
      return { previousDocuments };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents", workspaceId], context.previousDocuments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] });
    },
  });
}
