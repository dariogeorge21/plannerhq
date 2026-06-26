import { SupabaseClient } from "@supabase/supabase-js";
import { Section, Document, DocumentContent } from "./types";

export const createDocumentService = (supabase: SupabaseClient) => ({
  async getSections(workspaceId: string): Promise<Section[]> {
    const { data, error } = await supabase
      .from("document_sections")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async createSection(workspaceId: string, name: string): Promise<Section> {
    const { data: maxPosData } = await supabase
      .from("document_sections")
      .select("position")
      .eq("workspace_id", workspaceId)
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const position = maxPosData ? maxPosData.position + 1024 : 1024;

    const { data, error } = await supabase
      .from("document_sections")
      .insert({ workspace_id: workspaceId, name, position })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateSection(sectionId: string, name: string): Promise<Section> {
    const { data, error } = await supabase
      .from("document_sections")
      .update({ name })
      .eq("id", sectionId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteSection(sectionId: string): Promise<void> {
    const { error } = await supabase.from("document_sections").delete().eq("id", sectionId);
    if (error) throw new Error(error.message);
  },

  async reorderSections(updates: { id: string; position: number }[]): Promise<void> {
    // Basic approach: loop and update. A bulk upsert could be used but let's keep it simple.
    for (const update of updates) {
      await supabase.from("document_sections").update({ position: update.position }).eq("id", update.id);
    }
  },

  async getDocuments(workspaceId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async getDocument(documentId: string): Promise<Document> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async createDocument(workspaceId: string, sectionId: string, title: string = "Untitled"): Promise<Document> {
    const { data: maxPosData } = await supabase
      .from("documents")
      .select("position")
      .eq("section_id", sectionId)
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const position = maxPosData ? maxPosData.position + 1024 : 1024;

    const { data, error } = await supabase
      .from("documents")
      .insert({ workspace_id: workspaceId, section_id: sectionId, title, position })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Initialize document content
    await supabase.from("document_content").insert({ document_id: data.id, content: {} });

    return data;
  },

  async updateDocument(
    documentId: string,
    updates: { title?: string; icon?: string | null; cover?: string | null; section_id?: string }
  ): Promise<Document> {
    const { data, error } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", documentId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteDocument(documentId: string): Promise<void> {
    const { error } = await supabase.from("documents").delete().eq("id", documentId);
    if (error) throw new Error(error.message);
  },

  async reorderDocuments(updates: { id: string; position: number; sectionId: string }[]): Promise<void> {
    for (const update of updates) {
      await supabase
        .from("documents")
        .update({ position: update.position, section_id: update.sectionId })
        .eq("id", update.id);
    }
  },

  async getDocumentContent(documentId: string): Promise<DocumentContent> {
    const { data, error } = await supabase
      .from("document_content")
      .select("*")
      .eq("document_id", documentId)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || { document_id: documentId, content: {} };
  },

  async saveDocumentContent(documentId: string, content: any): Promise<void> {
    const { error } = await supabase
      .from("document_content")
      .upsert({ document_id: documentId, content, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
  },

  async listVersions(documentId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("document_versions")
      .select("*")
      .eq("document_id", documentId)
      .eq("is_deleted", false)
      .order("version_number", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async getVersion(versionId: string): Promise<any> {
    const { data, error } = await supabase
      .from("document_versions")
      .select("*")
      .eq("id", versionId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async createVersion(documentId: string, userId: string, label?: string): Promise<any> {
    const { data: contentData } = await supabase
      .from("document_content")
      .select("*")
      .eq("document_id", documentId)
      .single();

    if (!contentData || !contentData.content) {
      throw new Error("No document content found to version");
    }

    const { data: maxVersionData } = await supabase
      .from("document_versions")
      .select("version_number")
      .eq("document_id", documentId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    const versionNumber = maxVersionData ? maxVersionData.version_number + 1 : 1;

    const { data, error } = await supabase
      .from("document_versions")
      .insert({
        document_id: documentId,
        version_number: versionNumber,
        content: contentData.content,
        created_by: userId,
        label: label || `Version ${versionNumber}`,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async restoreVersion(documentId: string, versionId: string): Promise<void> {
    const { data: versionData } = await supabase
      .from("document_versions")
      .select("*")
      .eq("id", versionId)
      .single();

    if (!versionData) throw new Error("Version not found");

    const { error } = await supabase
      .from("document_content")
      .upsert({ document_id: documentId, content: versionData.content, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
  },

  async deleteVersion(versionId: string): Promise<void> {
    const { error } = await supabase
      .from("document_versions")
      .update({ is_deleted: true })
      .eq("id", versionId);

    if (error) throw new Error(error.message);
  },
});
