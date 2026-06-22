import { SupabaseClient } from "@supabase/supabase-js";
import { FileUpload, FileFilters, QuotaInfo, FileEntityType } from "./types";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const createFileService = (supabase: SupabaseClient) => ({
  async getQuota(workspaceId: string, userId: string): Promise<QuotaInfo> {
    // Read workspace storage used
    const { data: wsData, error: wsError } = await supabase
      .from("workspaces")
      .select("storage_used")
      .eq("id", workspaceId)
      .single();

    if (wsError) throw new Error("Failed to read workspace quota");
    const currentStorageBytes = wsData.storage_used || 0;

    // Get the user's subscription
    const { data: subData, error: subError } = await supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .maybeSingle();

    if (subError) {
      console.error("Subscription query error:", subError);
    }

    let maxStorageBytes = 104857600; 
    let maxFileUploadBytes = 1048576;

    if (subData?.plan_id) {
      const { data: planData, error: planError } = await supabase
        .from("plans")
        .select("max_storage_bytes, max_file_upload_bytes")
        .eq("id", subData.plan_id)
        .maybeSingle();

      if (planError) {
        console.error("Plan query error:", planError);
      }

      if (planData) {
        maxStorageBytes = Number(planData.max_storage_bytes);
        maxFileUploadBytes = Number(planData.max_file_upload_bytes);
      }
    }

    return {
      currentStorageBytes,
      maxStorageBytes,
      maxFileUploadBytes,
    };
  },

  async listFiles(workspaceId: string, filters?: FileFilters): Promise<FileUpload[]> {
    let query = supabase
      .from("file_uploads")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (filters?.entity_type) {
      query = query.eq("entity_type", filters.entity_type);
    }
    if (filters?.entity_id) {
      query = query.eq("entity_id", filters.entity_id);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  async uploadFile(
    file: File,
    workspaceId: string,
    entityType: FileEntityType,
    entityId: string,
    userId: string
  ): Promise<FileUpload> {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed.`);
    }

    const quota = await this.getQuota(workspaceId, userId);

    if (file.size > quota.maxFileUploadBytes) {
      throw new Error(`File size exceeds the limit of ${quota.maxFileUploadBytes / 1024 / 1024}MB.`);
    }

    if (quota.currentStorageBytes + file.size > quota.maxStorageBytes) {
      throw new Error(`Workspace storage quota exceeded. Please upgrade your plan.`);
    }

    const fileExt = file.name.split('.').pop() || 'bin';
    const fileUuid = crypto.randomUUID();
    const storagePath = `${workspaceId}/${entityType}/${entityId}/${fileUuid}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("workspace-files")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data, error: dbError } = await supabase
      .from("file_uploads")
      .insert({
        workspace_id: workspaceId,
        entity_type: entityType,
        entity_id: entityId,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: userId,
      })
      .select()
      .single();

    if (dbError) {
      // Rollback file upload
      await supabase.storage.from("workspace-files").remove([storagePath]);
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    return data;
  },

  async deleteFile(fileId: string, workspaceId: string): Promise<void> {
    // 1. Get the storage path
    const { data: fileData, error: fetchError } = await supabase
      .from("file_uploads")
      .select("storage_path")
      .eq("id", fileId)
      .eq("workspace_id", workspaceId)
      .single();

    if (fetchError || !fileData) throw new Error("File not found");

    // 2. Delete from DB
    const { error: dbError } = await supabase
      .from("file_uploads")
      .delete()
      .eq("id", fileId)
      .eq("workspace_id", workspaceId);

    if (dbError) throw new Error(dbError.message);

    // 3. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from("workspace-files")
      .remove([fileData.storage_path]);

    if (storageError) {
      console.error("Storage deletion error (cleanup failed):", storageError.message);
    }
  },

  async getSignedUrl(storagePath: string, download: boolean = false): Promise<string> {
    const { data, error } = await supabase.storage
      .from("workspace-files")
      .createSignedUrl(storagePath, 3600, {
        download,
      });

    if (error) throw new Error(error.message);
    return data.signedUrl;
  },
});
