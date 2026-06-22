"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createFileService } from "./services";
import { FileFilters, FileEntityType } from "./types";
import { UploadFileSchema, DeleteFileSchema, ListFilesSchema } from "./validations";

export async function getQuotaAction(workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createFileService(supabase);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Unauthorized");

    const quota = await service.getQuota(workspaceId, userData.user.id);
    return { success: true, data: quota };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function listFilesAction(workspaceId: string, filters?: FileFilters) {
  try {
    const supabase = await createClient();
    const service = createFileService(supabase);
    const files = await service.listFiles(workspaceId, filters);
    return { success: true, data: files };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const workspaceId = formData.get("workspaceId") as string;
    const entityType = formData.get("entityType") as FileEntityType;
    const entityId = formData.get("entityId") as string;

    if (!file || !workspaceId || !entityType || !entityId) {
      throw new Error("Missing required fields");
    }

    UploadFileSchema.parse({
      workspaceId,
      entityType,
      entityId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Unauthorized");

    const service = createFileService(supabase);
    const uploadedFile = await service.uploadFile(file, workspaceId, entityType, entityId, userData.user.id);

    revalidatePath(`/${workspaceId}/files`);
    console.log("Uploaded file:", uploadedFile);
    return { success: true, data: uploadedFile };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: error.message };
  }
}

export async function deleteFileAction(fileId: string, workspaceId: string) {
  try {
    DeleteFileSchema.parse({ fileId, workspaceId });

    const supabase = await createClient();
    const service = createFileService(supabase);

    await service.deleteFile(fileId, workspaceId);
    revalidatePath(`/${workspaceId}/files`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSignedUrlAction(storagePath: string, download: boolean = false) {
  try {
    const supabase = await createClient();
    const service = createFileService(supabase);

    const url = await service.getSignedUrl(storagePath, download);
    return { success: true, data: url };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
