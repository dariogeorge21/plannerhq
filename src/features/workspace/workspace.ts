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

    const { data: workspaceId, error: workspaceError } = await supabase.rpc('create_workspace_with_owner', {
        p_workspace_name: workspaceName,
        p_workspace_slug: slug,
        p_owner_id: user.id
    });
    if (workspaceError) {
        return { success: false, message: "Failed to create workspace" };
    }

    // Fetch the full workspace row to ensure avatar_url and all fields are returned
    const { data: workspace, error: fetchError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();
    if (fetchError) {
        // Workspace created but couldn't fetch full details – return basic info
        return { success: true, message: "Workspace created successfully", data: { id: workspaceId, name: workspaceName, slug } };
    }

    await incrementWorkspaceUsage(user.id, 1);

    revalidatePath('/dashboard');
    return { success: true, message: "Workspace created successfully", data: workspace };
}

export async function ArchieveWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const workspaceId = formData.get('workspaceId') as string;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "User not found" };

    const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();
    
    if (memberError || member?.role !== 'owner') {
        return { success: false, message: "Access denied. Only owners can archive workspaces." };
    }

    const { error: workspaceError } = await supabase
        .from('workspaces')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', workspaceId);

    if (workspaceError) {
        return { success: false, message: "Failed to archive workspace" }
    }
    
    await LogWorkspaceActivity(workspaceId, "archive_workspace", "workspace", workspaceId, {});
    revalidatePath('/dashboard');
    return { success: true, message: "Workspace archived successfully" };
}

export async function UnarchiveWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const workspaceId = formData.get('workspaceId') as string;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "User not found" };

    const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();
    
    if (memberError || member?.role !== 'owner') {
        return { success: false, message: "Access denied. Only owners can unarchive workspaces." };
    }

    const { error: workspaceError } = await supabase
        .from('workspaces')
        .update({ is_deleted: false, deleted_at: null })
        .eq('id', workspaceId);

    if (workspaceError) {
        return { success: false, message: "Failed to unarchive workspace" }
    }
    
    await LogWorkspaceActivity(workspaceId, "unarchive_workspace", "workspace", workspaceId, {});
    revalidatePath('/dashboard');
    return { success: true, message: "Workspace unarchived successfully" };
}

export async function UpdateWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    // Workspace name and description are fields that can be modified
    const supabase = await createClient();
    const workspaceName = formData.get('workspaceName') as string;
    const workspaceId = formData.get('workspaceId') as string;
    const workspaceDescription = formData.get('workspaceDescription') as string;
    const avatarUrl = formData.get('avatarUrl') as string | null;
    const workspaceSlug = formData.get('workspaceSlug') as string | null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "User not found" };

    const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();
    
    if (memberError || (member?.role !== 'owner' && member?.role !== 'admin')) {
        return { success: false, message: "Access denied. Only owners and admins can update settings." };
    }

    const updatePayload: any = {
        name: workspaceName,
        description: workspaceDescription
    };

    if (avatarUrl !== null) {
        updatePayload.avatar_url = avatarUrl;
    }

    if (workspaceSlug) {
        // Enforce basic slug rules
        updatePayload.slug = workspaceSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }

    const { error: workspaceError } = await supabase
        .from('workspaces')
        .update(updatePayload)
        .eq('id', workspaceId);

    if (workspaceError) {
        if (workspaceError.code === '23505') {
            return { success: false, message: "Workspace slug is already taken" };
        }
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
    memberCount: number;
    lastActive?: string | null;
    is_archived: boolean;
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
        .select('role, joined_at, last_active, workspaces!inner(id, name, slug, description, created_at, created_by, is_deleted, avatar_url)')
        .eq('user_id', user.id);

    if (error) {
        return { success: false, message: "Failed to list workspace" };
    }

    type RawMemberRow = {
        role: 'owner' | 'admin' | 'member';
        joined_at: string;
        last_active: string | null;
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

    const rawRows = data as unknown as RawMemberRow[];
    const workspaceIds = rawRows.map((item) => item.workspaces.id);
    const countsMap: Record<string, number> = {};

    if (workspaceIds.length > 0) {
        const { data: memberCounts, error: countError } = await supabase
            .from('workspace_members')
            .select('workspace_id')
            .in('workspace_id', workspaceIds);

        if (!countError && memberCounts) {
            memberCounts.forEach((m: any) => {
                countsMap[m.workspace_id] = (countsMap[m.workspace_id] || 0) + 1;
            });
        }
    }

    const allWorkspaces: WorkspaceListItem[] = rawRows.map((item) => ({
        id: item.workspaces.id,
        name: item.workspaces.name,
        slug: item.workspaces.slug,
        description: item.workspaces.description,
        created_at: item.workspaces.created_at,
        created_by: item.workspaces.created_by,
        role: item.role,
        joined_at: item.joined_at,
        avatar_url: item.workspaces.avatar_url,
        memberCount: countsMap[item.workspaces.id] || 1,
        lastActive: item.last_active,
        is_archived: item.workspaces.is_deleted
    }));

    const owned = allWorkspaces.filter(ws => ws.role === 'owner');
    const joined = allWorkspaces.filter(ws => ws.role === 'member' || ws.role === 'admin');

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

    // Fetch the user's role for this workspace
    const { data: member } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();

    return { success: true, message: "Workspace fetched successfully", data: { ...data, is_archived: data.is_deleted, role: member?.role } };
}

export async function GetWorkspaceIncludingArchived(workspaceId: string): Promise<{ success: boolean, message: string, data?: any }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

    if (error) {
        return { success: false, message: "Workspace not found" };
    }

    // Fetch the user's role for this workspace
    const { data: member } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();
    
    // Add is_archived alias and role
    const workspaceData = { ...data, is_archived: data.is_deleted, role: member?.role };
    return { success: true, message: "Workspace fetched successfully", data: workspaceData };
}

export async function GetWorkspaceMembers(workspaceId: string): Promise<{ success: boolean, message: string, data?: any[] }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('workspace_members')
        .select('role, joined_at, profiles(id, display_name, email, hqid, avatar_url, role)')
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
        avatar_url: item.profiles.avatar_url,
        profile_role: item.profiles.role
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
    await LogWorkspaceActivity(workspaceId, "update_member_role", "member", userId, { role });
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

    const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();
    
    if (memberError || member?.role === 'owner') {
        return { success: false, message: "Owners cannot leave the workspace. Transfer ownership or archive it instead." };
    }

    const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id);

    if (error) {
        return { success: false, message: "Failed to leave workspace" };
    }
    await LogWorkspaceActivity(workspaceId, "leave_workspace", "workspace", workspaceId, {});
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

export async function UpdateWorkspaceLastActive(workspaceId: string): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const { error } = await supabase
        .from('workspace_members')
        .update({ last_active: new Date().toISOString() })
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id);

    if (error) {
        return { success: false, message: "Failed to update last active" };
    }
    
    return { success: true, message: "Last active updated successfully" };
}

export async function LogWorkspaceActivity(
    workspaceId: string,
    actionType: string,
    entityType: string,
    entityId: string | null = null,
    metadata: any = {}
): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
        await supabase.from('workspace_activity_logs').insert({
            workspace_id: workspaceId,
            user_id: user.id,
            action_type: actionType,
            entity_type: entityType,
            entity_id: entityId,
            metadata: metadata
        });
    } catch (error) {
        console.error("Failed to log workspace activity:", error);
    }
}

export async function GetWorkspaceActivityLogs(workspaceId: string, page: number = 1, pageSize: number = 20): Promise<{ success: boolean, message: string, data?: any[], totalCount?: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    // Verify user is owner
    const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();
    
    if (memberError || member?.role !== 'owner') {
        return { success: false, message: "Access denied" };
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
        .from('workspace_activity_logs')
        .select('*, profiles(display_name, avatar_url, email)', { count: 'exact' })
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error) {
        return { success: false, message: "Failed to fetch workspace logs" };
    }

    return { success: true, message: "Logs fetched successfully", data, totalCount: count || 0 };
}
