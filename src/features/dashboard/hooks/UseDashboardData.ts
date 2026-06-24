import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { ListWorkspace } from '@/features/workspace/workspace';
import { ListInvitationsForUser } from '@/features/workspace/invites';
import { GetUserProfileOverview, type ProfileOverviewData } from '@/features/dashboard/services';

export type { ProfileOverviewData };

export function useUserWorkspaces() {
    return useQuery({
        queryKey: ['dashboard_workspaces'],
        queryFn: async () => {
            const res = await ListWorkspace();
            if (res.success && res.data) {
                // Combine owned and joined and sort by joined_at descending
                const all = [...res.data.owned, ...res.data.joined];
                all.sort((a, b) => {
                    const aTime = a.lastActive ? new Date(a.lastActive).getTime() : new Date(a.joined_at).getTime();
                    const bTime = b.lastActive ? new Date(b.lastActive).getTime() : new Date(b.joined_at).getTime();
                    return bTime - aTime;
                });
                return all;
            }
            return [];
        },
    });
}

export function useUserPendingInvitations() {
    return useQuery({
        queryKey: ['dashboard_invitations'],
        queryFn: async () => {
            const res = await ListInvitationsForUser();
            if (res.success && res.data) {
                return res.data;
            }
            return [];
        },
    });
}

export function useUserTasks(userId: string | undefined) {
    return useQuery({
        queryKey: ['dashboard_tasks', userId],
        queryFn: async () => {
            if (!userId) return [];
            const supabase = createClient();

            // Get all tasks assigned to the user
            const { data, error } = await supabase
                .from('task_assignees')
                .select(`
                    task_id,
                    tasks!inner (
                        id, title, status, priority, due_date, workspace_id, is_deleted,
                        workspaces ( name )
                    )
                `)
                .eq('user_id', userId);

            if (error) {
                console.error("Error fetching user tasks:", error);
                return [];
            }

            const tasks = data
                .map((row: any) => row.tasks)
                .filter((t: any) => !t.is_deleted);

            // Sort by priority or due date? Let's do simple sort
            return tasks;
        },
        enabled: !!userId,
    });
}

export function useDashboardCalendarEvents(userId: string | undefined) {
    return useQuery({
        queryKey: ['dashboard_calendar_events', userId],
        queryFn: async () => {
            if (!userId) return [];
            const supabase = createClient();

            const todayStr = new Date().toISOString().split('T')[0];
            const startOfDay = `${todayStr}T00:00:00Z`;
            const endOfDay = `${todayStr}T23:59:59Z`;

            // Get user's workspaces
            const { data: memberData } = await supabase
                .from('workspace_members')
                .select('workspace_id')
                .eq('user_id', userId);

            const workspaceIds = memberData?.map(m => m.workspace_id) || [];

            if (workspaceIds.length === 0) return [];

            const { data, error } = await supabase
                .from('calendar_events')
                .select(`*`)
                .in('workspace_id', workspaceIds)
                .gte('end_at', startOfDay)
                .lte('start_at', endOfDay)
                .order('start_at', { ascending: true });

            if (error) {
                console.error("Error fetching calendar events:", error);
                return [];
            }

            return data;
        },
        enabled: !!userId,
    });
}

/**
 * Full profile overview hook — fetches identity + workspace stats in one call.
 * Use this for ProfileOverviewCard.
 */
export function useUserProfileOverview() {
    return useQuery({
        queryKey: ['dashboard_profile_overview'],
        queryFn: async () => {
            const res = await GetUserProfileOverview();
            if (res.success && res.data) {
                return res.data;
            }
            return null;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Lightweight stats hook kept for backward compatibility with KpiMetrics.
 * Prefer useUserProfileOverview for the ProfileOverviewCard.
 */
export function useUserProfileStats(userId: string | undefined) {
    return useQuery({
        queryKey: ['dashboard_profile_stats', userId],
        queryFn: async () => {
            if (!userId) return { workspaceCount: 0, timeTrackedSeconds: 0 };
            const supabase = createClient();

            const { data, error } = await supabase
                .from('workspace_members')
                .select('time_spent_seconds, workspace_id')
                .eq('user_id', userId);

            if (error || !data) {
                return { workspaceCount: 0, timeTrackedSeconds: 0 };
            }

            const workspaceCount = data.length;
            const timeTrackedSeconds = data.reduce((acc, curr) => acc + (curr.time_spent_seconds || 0), 0);

            return { workspaceCount, timeTrackedSeconds };
        },
        enabled: !!userId,
    });
}