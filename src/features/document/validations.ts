import { z } from "zod";

export const CreateSectionSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  name: z.string().min(1, "Name is required").max(100),
});

export const UpdateSectionSchema = z.object({
  sectionId: z.string().uuid("Invalid section ID"),
  name: z.string().min(1, "Name is required").max(100),
});

export const ReorderSectionsSchema = z.array(
  z.object({
    id: z.string().uuid(),
    position: z.number(),
  })
);

export const CreateDocumentSchema = z.object({
  sectionId: z.string().uuid("Invalid section ID"),
  workspaceId: z.string().uuid("Invalid workspace ID"),
  title: z.string().min(1, "Title is required").max(200).optional().default("Untitled"),
});

export const UpdateDocumentSchema = z.object({
  documentId: z.string().uuid("Invalid document ID"),
  title: z.string().min(1).max(200).optional(),
  icon: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  sectionId: z.string().uuid().optional(),
});

export const ReorderDocumentsSchema = z.array(
  z.object({
    id: z.string().uuid(),
    position: z.number(),
    sectionId: z.string().uuid(),
  })
);

export const SaveDocumentContentSchema = z.object({
  documentId: z.string().uuid("Invalid document ID"),
  content: z.any(),
});

export const CreateVersionSchema = z.object({
  documentId: z.string().uuid("Invalid document ID"),
  label: z.string().max(100).optional(),
});

export const RestoreVersionSchema = z.object({
  documentId: z.string().uuid("Invalid document ID"),
  versionId: z.string().uuid("Invalid version ID"),
});

export const ToggleFavoriteSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  documentId: z.string().uuid("Invalid document ID"),
  isFavorite: z.boolean(),
});

// ── Rename schemas (intentionally narrow — title/name only) ──────────────────

export const RenameDocumentSchema = z.object({
  documentId: z.string().uuid("Invalid document ID"),
  title: z.string().min(1, "Title cannot be empty").max(200, "Title is too long").trim(),
});

export const RenameSectionSchema = z.object({
  sectionId: z.string().uuid("Invalid section ID"),
  name: z.string().min(1, "Name cannot be empty").max(100, "Name is too long").trim(),
});
