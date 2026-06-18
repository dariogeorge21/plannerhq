"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createDocumentService } from "./services";
import {
  CreateSectionSchema,
  UpdateSectionSchema,
  ReorderSectionsSchema,
  CreateDocumentSchema,
  UpdateDocumentSchema,
  ReorderDocumentsSchema,
  SaveDocumentContentSchema,
  CreateVersionSchema,
  RestoreVersionSchema,
} from "./validations";

export async function createSectionAction(payload: unknown) {
  try {
    const data = CreateSectionSchema.parse(payload);
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    const section = await service.createSection(data.workspaceId, data.name);
    revalidatePath(`/${data.workspaceId}`);
    return { success: true, data: section };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSectionAction(payload: unknown) {
  try {
    const data = UpdateSectionSchema.parse(payload);
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    const section = await service.updateSection(data.sectionId, data.name);
    revalidatePath(`/${section.workspace_id}`);
    return { success: true, data: section };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSectionAction(sectionId: string, workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    await service.deleteSection(sectionId);
    revalidatePath(`/${workspaceId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderSectionsAction(payload: unknown, workspaceId: string) {
  try {
    const data = ReorderSectionsSchema.parse(payload);
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    await service.reorderSections(data);
    revalidatePath(`/${workspaceId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDocumentAction(payload: unknown) {
  try {
    const data = CreateDocumentSchema.parse(payload);
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    const document = await service.createDocument(data.workspaceId, data.sectionId, data.title);
    revalidatePath(`/${data.workspaceId}`);
    return { success: true, data: document };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDocumentAction(payload: unknown, workspaceId: string) {
  try {
    const data = UpdateDocumentSchema.parse(payload);
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    const document = await service.updateDocument(data.documentId, {
      title: data.title,
      icon: data.icon,
      cover: data.cover,
      section_id: data.sectionId,
    });
    
    revalidatePath(`/${workspaceId}`);
    revalidatePath(`/${workspaceId}/docs/${data.documentId}`);
    return { success: true, data: document };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDocumentAction(documentId: string, workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    await service.deleteDocument(documentId);
    revalidatePath(`/${workspaceId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderDocumentsAction(payload: unknown, workspaceId: string) {
  try {
    const data = ReorderDocumentsSchema.parse(payload);
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    await service.reorderDocuments(data);
    revalidatePath(`/${workspaceId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveDocumentContentAction(payload: unknown, workspaceId: string) {
  try {
    const data = SaveDocumentContentSchema.parse(payload);
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    await service.saveDocumentContent(data.documentId, data.content);
    // Note: intentionally not revalidating everything for performance on typing autosave
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createVersionAction(payload: unknown, userId: string) {
  try {
    const data = CreateVersionSchema.parse(payload);
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    const version = await service.createVersion(data.documentId, userId, data.label);
    return { success: true, data: version };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function listVersionsAction(documentId: string) {
  try {
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    const versions = await service.listVersions(documentId);
    return { success: true, data: versions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function restoreVersionAction(payload: unknown) {
  try {
    const data = RestoreVersionSchema.parse(payload);
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    await service.restoreVersion(data.documentId, data.versionId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteVersionAction(versionId: string) {
  try {
    const supabase = await createClient();
    const service = createDocumentService(supabase);
    
    await service.deleteVersion(versionId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
