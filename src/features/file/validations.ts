import { z } from "zod";

export const UploadFileSchema = z.object({
  workspaceId: z.string().uuid(),
  entityType: z.enum(["workspace", "document", "task"]),
  entityId: z.string().uuid(),
  fileName: z.string().min(1).max(255),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1).max(100),
});

export const DeleteFileSchema = z.object({
  fileId: z.string().uuid(),
  workspaceId: z.string().uuid(),
});

export const ListFilesSchema = z.object({
  workspaceId: z.string().uuid(),
  entityType: z.enum(["workspace", "document", "task"]).optional(),
  entityId: z.string().uuid().optional(),
});
