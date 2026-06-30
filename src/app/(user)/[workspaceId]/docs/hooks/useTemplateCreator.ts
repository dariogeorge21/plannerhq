import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { createDocumentService } from "@/features/document/services";
import { Section, Document } from "@/features/document/types";

export type TemplateId = "blank" | "meeting" | "prd";

interface UseTemplateCreatorOptions {
  workspaceId: string;
  sections: Section[] | undefined;
  documents: Document[] | undefined;
}

interface TemplateCreatorState {
  isGenerating: boolean;
  activeTemplate: TemplateId | null;
}

// ── Tiptap JSON content factories ────────────────────────────────────────────

function buildBlankContent() {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [],
      },
    ],
  };
}

function buildMeetingNotesContent(date: string) {
  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: `Meeting Notes - ${date}` }],
      },
      {
        type: "horizontalRule",
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Start writing your meeting points here...",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

function buildProductSpecContent(date: string) {
  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: `Product Specifications - ${date}` }],
      },
      {
        type: "horizontalRule",
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "About Product....Start Writing" }],
      },
      {
        type: "horizontalRule",
      },
      {
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Describe your product specifications here...",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

// ── Name deduplication ────────────────────────────────────────────────────────

function deduplicateTitle(baseTitle: string, existingDocs: Document[], sectionId: string): string {
  const sectionDocs = existingDocs.filter((d) => d.section_id === sectionId);
  const titles = new Set(sectionDocs.map((d) => d.title.toLowerCase()));

  if (!titles.has(baseTitle.toLowerCase())) return baseTitle;

  let counter = 1;
  while (titles.has(`${baseTitle.toLowerCase()}(${counter})`)) {
    counter++;
  }
  return `${baseTitle}(${counter})`;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTemplateCreator({
  workspaceId,
  sections,
  documents,
}: UseTemplateCreatorOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, setState] = useState<TemplateCreatorState>({
    isGenerating: false,
    activeTemplate: null,
  });

  const createFromTemplate = useCallback(
    async (templateId: TemplateId) => {
      setState({ isGenerating: true, activeTemplate: templateId });

      try {
        const supabase = createClient();
        const service = createDocumentService(supabase);

        // ── 1. Find or create the "General" section ────────────────────────
        let generalSection = sections?.find(
          (s) => s.name.toLowerCase() === "general"
        );

        if (!generalSection) {
          generalSection = await service.createSection(workspaceId, "General");
          // Optimistically update sections cache
          queryClient.invalidateQueries({
            queryKey: ["document_sections", workspaceId],
          });
        }

        // ── 2. Determine document title ────────────────────────────────────
        const baseTitles: Record<TemplateId, string> = {
          blank: "Blank Document",
          meeting: "Meeting Notes",
          prd: "Product Specifications",
        };

        const baseTitle = baseTitles[templateId];
        const allDocs = documents ?? [];
        const finalTitle = deduplicateTitle(baseTitle, allDocs, generalSection.id);

        // ── 3. Create the document ─────────────────────────────────────────
        const doc = await service.createDocument(
          workspaceId,
          generalSection.id,
          finalTitle
        );

        // ── 4. Build and save initial content ─────────────────────────────
        const today = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const contentBuilders: Record<TemplateId, () => object> = {
          blank: buildBlankContent,
          meeting: () => buildMeetingNotesContent(today),
          prd: () => buildProductSpecContent(today),
        };

        const initialContent = contentBuilders[templateId]();
        await service.saveDocumentContent(doc.id, initialContent);

        // ── 5. Invalidate caches so sidebar & dashboard update ─────────────
        await queryClient.invalidateQueries({
          queryKey: ["documents", workspaceId],
        });
        await queryClient.invalidateQueries({
          queryKey: ["document_sections", workspaceId],
        });

        // ── 6. Hold the modal for dramatic effect, then navigate ───────────
        await new Promise((resolve) => setTimeout(resolve, 2200));
        router.push(`/${workspaceId}/docs/${doc.id}`);
      } catch (error) {
        console.error("[useTemplateCreator] Failed to create document:", error);
      } finally {
        setState({ isGenerating: false, activeTemplate: null });
      }
    },
    [workspaceId, sections, documents, router, queryClient]
  );

  return {
    ...state,
    createFromTemplate,
  };
}
