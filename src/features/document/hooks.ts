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
  toggleFavoriteAction,
  renameDocumentAction,
  renameSectionAction,
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
    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: ["document_sections", workspaceId] });
      const previous = queryClient.getQueryData<any[]>(["document_sections", workspaceId]);
      if (previous) {
        const optimistic = {
          id: `temp-${Date.now()}`,
          workspace_id: workspaceId,
          name,
          position: previous.length ? Math.max(...previous.map(p => p.position || 0)) + 1024 : 1024,
          created_by: "temp",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData(["document_sections", workspaceId], [...previous, optimistic]);
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["document_sections", workspaceId], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["document_sections", workspaceId] }),
  });
}

export function useCreateDocument(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sectionId: string; title: string }) =>
      createDocumentAction({ workspaceId, sectionId: data.sectionId, title: data.title }),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["documents", workspaceId] });
      const previous = queryClient.getQueryData<any[]>(["documents", workspaceId]);
      if (previous) {
        const sectionDocs = previous.filter(d => d.section_id === data.sectionId);
        const maxPos = sectionDocs.length ? Math.max(...sectionDocs.map(d => d.position || 0)) : 0;
        const optimistic = {
          id: `temp-${Date.now()}`,
          workspace_id: workspaceId,
          section_id: data.sectionId,
          title: data.title,
          icon: null,
          cover: null,
          position: maxPos + 1024,
          created_by: "temp",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData(["documents", workspaceId], [...previous, optimistic]);
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["documents", workspaceId], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] }),
  });
}

export function useUpdateDocument(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { documentId: string; title?: string; icon?: string | null; cover?: string | null; sectionId?: string }) =>
      updateDocumentAction(data, workspaceId),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["documents", workspaceId] });
      await queryClient.cancelQueries({ queryKey: ["document", data.documentId] });

      const previous = queryClient.getQueryData<any[]>(["documents", workspaceId]);
      if (previous) {
        const updated = previous.map((doc) =>
          doc.id === data.documentId ? { ...doc, ...data, section_id: data.sectionId || doc.section_id } : doc
        );
        queryClient.setQueryData(["documents", workspaceId], updated);
      }

      const previousDoc = queryClient.getQueryData<any>(["document", data.documentId]);
      if (previousDoc) {
        queryClient.setQueryData(["document", data.documentId], { ...previousDoc, ...data, section_id: data.sectionId || previousDoc.section_id });
      }

      return { previous, previousDoc };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["documents", workspaceId], context.previous);
      }
      if (context?.previousDoc) {
        queryClient.setQueryData(["document", variables.documentId], context.previousDoc);
      }
    },
    onSettled: (res, err, vars) => {
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
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["document_sections", workspaceId] });
      const previous = queryClient.getQueryData<any[]>(["document_sections", workspaceId]);
      if (previous) {
        const updated = previous.map((section) =>
          section.id === data.sectionId ? { ...section, name: data.name } : section
        );
        queryClient.setQueryData(["document_sections", workspaceId], updated);
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["document_sections", workspaceId], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["document_sections", workspaceId] }),
  });
}

export function useDeleteSection(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: string) => deleteSectionAction(sectionId, workspaceId),
    onMutate: async (sectionId) => {
      await queryClient.cancelQueries({ queryKey: ["document_sections", workspaceId] });
      const previous = queryClient.getQueryData<any[]>(["document_sections", workspaceId]);
      if (previous) {
        queryClient.setQueryData(["document_sections", workspaceId], previous.filter(s => s.id !== sectionId));
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["document_sections", workspaceId], context.previous);
      }
    },
    onSettled: () => {
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
    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: ["documents", workspaceId] });
      const previous = queryClient.getQueryData<any[]>(["documents", workspaceId]);
      if (previous) {
        queryClient.setQueryData(["documents", workspaceId], previous.filter(d => d.id !== documentId));
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["documents", workspaceId], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] }),
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

export function useFavoriteDocuments(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["favorite_documents", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const supabase = createClient();
      const service = createDocumentService(supabase);
      return service.getFavoriteDocuments(workspaceId);
    },
    enabled: !!workspaceId,
  });
}

export function useToggleFavoriteDocument(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { documentId: string; isFavorite: boolean }) =>
      toggleFavoriteAction({ workspaceId, documentId: data.documentId, isFavorite: data.isFavorite }, workspaceId),
    onMutate: async ({ documentId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["favorite_documents", workspaceId] });
      const previousFavorites = queryClient.getQueryData<any[]>(["favorite_documents", workspaceId]);

      if (previousFavorites) {
        let updatedFavorites = [...previousFavorites];
        if (isFavorite) {
          // Optimistically add
          // We don't have the full document details, so we might need to invalidate immediately 
          // or we can just fetch the document from cache if possible.
          // For simplicity and correctness, we will just invalidate on success.
          // But to be slightly optimistic, let's just use the previous for now.
        } else {
          // Optimistically remove
          updatedFavorites = updatedFavorites.filter(fav => fav.document_id !== documentId);
        }
        queryClient.setQueryData(["favorite_documents", workspaceId], updatedFavorites);
      }
      return { previousFavorites };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorite_documents", workspaceId], context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite_documents", workspaceId] });
    },
  });
}

// ── Inline Rename Hooks ───────────────────────────────────────────────────────
// These use fully optimistic updates: the cache is mutated before the server
// call fires. On error the previous snapshot is restored automatically.

export function useRenameDocument(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { documentId: string; title: string }) =>
      renameDocumentAction(vars, workspaceId),

    onMutate: async ({ documentId, title }) => {
      await queryClient.cancelQueries({ queryKey: ["documents", workspaceId] });
      await queryClient.cancelQueries({ queryKey: ["document", documentId] });

      const previousList = queryClient.getQueryData<any[]>(["documents", workspaceId]);
      const previousDoc = queryClient.getQueryData<any>(["document", documentId]);

      if (previousList) {
        queryClient.setQueryData(
          ["documents", workspaceId],
          previousList.map((d) => (d.id === documentId ? { ...d, title } : d))
        );
      }
      if (previousDoc) {
        queryClient.setQueryData(["document", documentId], { ...previousDoc, title });
      }

      return { previousList, previousDoc };
    },

    onError: (_err, { documentId }, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(["documents", workspaceId], context.previousList);
      }
      if (context?.previousDoc) {
        queryClient.setQueryData(["document", documentId], context.previousDoc);
      }
    },

    onSettled: (_res, _err, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
    },
  });
}

export function useRenameSection(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { sectionId: string; name: string }) =>
      renameSectionAction(vars, workspaceId),

    onMutate: async ({ sectionId, name }) => {
      await queryClient.cancelQueries({ queryKey: ["document_sections", workspaceId] });

      const previousSections = queryClient.getQueryData<any[]>(["document_sections", workspaceId]);

      if (previousSections) {
        queryClient.setQueryData(
          ["document_sections", workspaceId],
          previousSections.map((s) => (s.id === sectionId ? { ...s, name } : s))
        );
      }

      return { previousSections };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousSections) {
        queryClient.setQueryData(["document_sections", workspaceId], context.previousSections);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["document_sections", workspaceId] });
    },
  });
}
