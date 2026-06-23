"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkWorkspaceLimit, incrementWorkspaceUsage } from "@/features/billing/usage";

export async function CreateWorkspace(formData: FormData): Promise<{ success: boolean, message: string, data?: any }> {
    const supabase = await createClient();
    const workspaceName = formData.get('workspaceName') as string;
    const slug = workspaceName.toLocaleLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const limitCheck = await checkWorkspaceLimit(user.id);
    if (!limitCheck.allowed) {
        return { success: false, message: `Workspace limit reached (${limitCheck.current}/${limitCheck.limit}). Please upgrade your plan.` };
    }

    const { data: workspace, error: workspaceError } = await supabase.rpc('create_workspace_with_owner', {
        p_workspace_name: workspaceName,
        p_workspace_slug: slug,
        p_owner_id: user.id
    });
    if (workspaceError) {
        return { success: false, message: "Failed to create workspace" };
    }

    await incrementWorkspaceUsage(user.id, 1);

    revalidatePath('/dashboard');
    return { success: true, message: "Workspace created successfully", data: workspace };
}

// Workspace Deletion is not allowed, only archive

export async function ArchieveWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const workspaceId = formData.get('workspaceId') as string;

    const { error: workspaceError } = await supabase
        .from('workspaces')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', workspaceId);

    if (workspaceError) {
        return { success: false, message: "Failed to archive workspace" }
    }
    revalidatePath('/dashboard');
    return { success: true, message: "Workspace archived successfully" };
}

export async function UpdateWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    // Workspace name and description are fields that can be modified
    const supabase = await createClient();
    const workspaceName = formData.get('workspaceName') as string;
    const workspaceId = formData.get('workspaceId') as string;
    const workspaceDescription = formData.get('workspaceDescription') as string;
    const avatarUrl = formData.get('avatarUrl') as string | null;

    const updatePayload: any = {
        name: workspaceName,
        description: workspaceDescription
    };

    if (avatarUrl !== null) {
        updatePayload.avatar_url = avatarUrl;
    }

    const { error: workspaceError } = await supabase
        .from('workspaces')
        .update(updatePayload)
        .eq('id', workspaceId);

    if (workspaceError) {
        return { success: false, message: "Failed to update workspace" }
    }
    revalidatePath('/dashboard');
    revalidatePath(`/${workspaceId}`);
    return { success: true, message: "Workspace updated successfully" };
}

export type WorkspaceListItem = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    created_by: string;
    role: 'owner' | 'admin' | 'member';
    joined_at: string;
    avatar_url: string | null;
};

export type ListWorkspaceResult = {
    success: boolean;
    message: string;
    data?: {
        owned: WorkspaceListItem[];
        joined: WorkspaceListItem[];
    };
};

export async function ListWorkspace(): Promise<ListWorkspaceResult> {
    // list all workspaces for a user (both owned and joined)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const { data, error } = await supabase
        .from('workspace_members')
        .select('role, joined_at, workspaces!inner(id, name, slug, description, created_at, created_by, is_deleted, avatar_url)')
        .eq('user_id', user.id)
        .filter('workspaces.is_deleted', 'eq', false);

    if (error) {
        return { success: false, message: "Failed to list workspace" };
    }

    type RawMemberRow = {
        role: 'owner' | 'admin' | 'member';
        joined_at: string;
        workspaces: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            created_at: string;
            created_by: string;
            is_deleted: boolean;
            avatar_url: string | null;
        };
    };

    const allWorkspaces: WorkspaceListItem[] = (data as unknown as RawMemberRow[]).map((item) => ({
        id: item.workspaces.id,
        name: item.workspaces.name,
        slug: item.workspaces.slug,
        description: item.workspaces.description,
        created_at: item.workspaces.created_at,
        created_by: item.workspaces.created_by,
        role: item.role,
        joined_at: item.joined_at,
        avatar_url: item.workspaces.avatar_url
    }));

    const owned = allWorkspaces.filter(ws => ws.role === 'owner' || ws.role === 'admin');
    const joined = allWorkspaces.filter(ws => ws.role === 'member');

    return { success: true, message: "Workspace listed successfully", data: { owned, joined } };
}

export async function GetWorkspace(workspaceId: string): Promise<{ success: boolean, message: string, data?: any }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .eq('is_deleted', false)
        .single();

    if (error) {
        return { success: false, message: "Workspace not found" };
    }
    return { success: true, message: "Workspace fetched successfully", data };
}

export async function GetWorkspaceMembers(workspaceId: string): Promise<{ success: boolean, message: string, data?: any[] }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('workspace_members')
        .select('role, joined_at, profiles(id, display_name, email, hqid, avatar_url)')
        .eq('workspace_id', workspaceId);

    if (error) {
        return { success: false, message: "Failed to fetch workspace members" };
    }

    const members = data.map((item: any) => ({
        user_id: item.profiles.id,
        role: item.role,
        joined_at: item.joined_at,
        display_name: item.profiles.display_name,
        email: item.profiles.email,
        hqid: item.profiles.hqid,
        avatar_url: item.profiles.avatar_url
    }));

    return { success: true, message: "Workspace members fetched successfully", data: members };
}

export async function UpdateMemberRole(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const workspaceId = formData.get('workspaceId') as string;
    const userId = formData.get('userId') as string;
    const role = formData.get('role') as string; // 'admin' | 'member' (cannot change owner via simple update)

    const { error } = await supabase
        .from('workspace_members')
        .update({ role })
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);

    if (error) {
        return { success: false, message: "Failed to update member role" };
    }
    revalidatePath(`/${workspaceId}`);
    revalidatePath(`/${workspaceId}/members`);
    return { success: true, message: "Member role updated successfully" };
}

export async function LeaveWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const workspaceId = formData.get('workspaceId') as string;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id);

    if (error) {
        return { success: false, message: "Failed to leave workspace" };
    }
    revalidatePath('/dashboard');
    return { success: true, message: "Left workspace successfully" };
}

export async function GetWorkspaceTime(workspaceId: string): Promise<{ success: boolean, message: string, data?: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const { data, error } = await supabase
        .from('workspace_members')
        .select('time_spent_seconds')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();

    if (error) {
        return { success: false, message: "Failed to fetch workspace time" };
    }

    return { success: true, message: "Time fetched", data: data.time_spent_seconds || 0 };
}

export async function TrackWorkspaceTime(workspaceId: string, seconds: number): Promise<{ success: boolean, message: string, data?: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const { data, error } = await supabase.rpc('increment_workspace_time_spent', {
        p_workspace_id: workspaceId,
        p_user_id: user.id,
        p_seconds: seconds
    });

    if (error) {
        return { success: false, message: "Failed to update workspace time" };
    }

    return { success: true, message: "Time updated", data: data as number };
}
