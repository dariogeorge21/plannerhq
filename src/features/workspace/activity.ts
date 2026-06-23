"use server";

import { createClient } from "@/lib/supabase/server";
import { WorkspaceActivityLog } from "@/types/workspace";

/**
 * Log a new activity in the workspace
 */
export async function LogWorkspaceActivity(
    workspaceId: string,
    actionType: string,
    entityType: string,
    entityId?: string | null,
    metadata?: any
): Promise<{ success: boolean; message: string }> {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Not authenticated" };

    const { error } = await supabase
        .from('workspace_activity_logs')
        .insert({
            workspace_id: workspaceId,
            user_id: user.id,
            action_type: actionType,
            entity_type: entityType,
            entity_id: entityId || null,
            metadata: metadata || {}
        });

    if (error) {
        console.error("Failed to log activity:", error);
        return { success: false, message: "Failed to log activity" };
    }

    return { success: true, message: "Activity logged" };
}

/**
 * Fetch recent activity for a workspace
 */
export async function GetWorkspaceActivity(
    workspaceId: string,
    limit: number = 20
): Promise<{ success: boolean; message: string; data?: WorkspaceActivityLog[] }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('workspace_activity_logs')
        .select(`
            id,
            workspace_id,
            user_id,
            action_type,
            entity_type,
            entity_id,
            metadata,
            created_at,
            profiles (
                display_name,
                avatar_url,
                email
            )
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Failed to fetch activity:", error);
        return { success: false, message: "Failed to fetch activity" };
    }

    // Type casting
    const logs = data as unknown as WorkspaceActivityLog[];
    return { success: true, message: "Activity fetched successfully", data: logs };
}

/**
 * Fetch recent activity for a specific member
 */
export async function GetMemberActivity(
    workspaceId: string,
    userId: string,
    limit: number = 10
): Promise<{ success: boolean; message: string; data?: WorkspaceActivityLog[] }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('workspace_activity_logs')
        .select(`
            id,
            workspace_id,
            user_id,
            action_type,
            entity_type,
            entity_id,
            metadata,
            created_at,
            profiles (
                display_name,
                avatar_url,
                email
            )
        `)
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Failed to fetch member activity:", error);
        return { success: false, message: "Failed to fetch member activity" };
    }

    const logs = data as unknown as WorkspaceActivityLog[];
    return { success: true, message: "Member activity fetched successfully", data: logs };
}
