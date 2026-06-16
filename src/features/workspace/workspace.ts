"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function CreateWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const workspaceName = formData.get('workspaceName') as string;
    const slug = workspaceName.toLocaleLowerCase().replace(/\s+/g, '-') + Math.random().toString(36).substring(2, 7);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const { data: workspace, error: workspaceError } = await supabase.rpc('create_workspace_with_owner', {
        p_workspace_name: workspaceName,
        p_workspace_slug: slug,
        p_owner_id: user.id
    });
    if (workspaceError) {
        return { success: false, message: "Failed to create workspace" };
    }
    revalidatePath('/dashboard');
    return { success: true, message: "Workspace created successfully" };
}

// Workspace Deletion is not allowed, only archieve

export async function ArchieveWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    // no rpc function, straight done by the owner only

    const workspaceId = formData.get('workspaceId') as string;

    const { data: workspace, error: workspaceError } = await supabase
        .from('workspace')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', workspaceId)
    if (workspaceError) {
        return { success: false, message: "Failed to archive workspace" }
    }
    revalidatePath('/dashboard');
    return { success: true, message: "Workspace archived successfully" };
}

export async function UpdateWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    // Workspace name, slug, description are only fields that can be modified
    const supabase = await createClient();
    const workspaceName = formData.get('workspaceName') as string;
    const workspaceId = formData.get('workspaceId') as string;
    const workspaceDescription = formData.get('workspaceDescription') as string;

    const { data: workspace, error: workspaceError } = await supabase
        .from('workspace')
        .update({ workspace_name: workspaceName, workspace_description: workspaceDescription, updated_at: new Date().toISOString() })
        .eq('id', workspaceId)
    if (workspaceError) {
        return { success: false, message: "Failed to update workspace" }
    }
    revalidatePath('/dashboard');
    return { success: true, message: "Workspace updated successfully" };
}

export async function ListWorkspace(): Promise<{ success: boolean, message: string, data?: any[] }> {
    // list all workspaces for a user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }
    const { data, error } = await supabase.from('workspaces').select('*').eq('created_by', user.id);
    if (error) {
        return { success: false, message: "Failed to list workspace" }
    }
    return { success: true, message: "Workspace listed successfully", data };
}