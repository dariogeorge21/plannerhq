"use server";

import { createClient } from "@/lib/supabase/server";

export type WorkspaceTimeData = {
    workspaceId: string;
    workspaceName: string;
    workspaceSlug: string;
    avatarUrl: string | null;
    timeSpentSeconds: number;
};

export async function GetWorkspaceTimeSpent(): Promise<{
    success: boolean;
    message: string;
    data?: WorkspaceTimeData[];
}> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, message: "User not authenticated" };
    }

    const { data, error } = await supabase
        .from('workspace_members')
        .select(`
            time_spent_seconds,
            workspaces!inner(id, name, slug, avatar_url, is_deleted)
        `)
        .eq('user_id', user.id)
        .filter('workspaces.is_deleted', 'eq', false);

    if (error || !data) {
        return { success: false, message: "Failed to fetch time spent" };
    }

    const formattedData: WorkspaceTimeData[] = (data as any[]).map((item) => ({
        workspaceId: item.workspaces.id,
        workspaceName: item.workspaces.name,
        workspaceSlug: item.workspaces.slug,
        avatarUrl: item.workspaces.avatar_url,
        timeSpentSeconds: item.time_spent_seconds || 0,
    })).sort((a, b) => b.timeSpentSeconds - a.timeSpentSeconds);

    return {
        success: true,
        message: "Time spent fetched successfully",
        data: formattedData,
    };
}
