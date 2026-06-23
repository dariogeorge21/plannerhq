// features/dashboard/hooks/useDashboardData.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useRecentWorkspaces() {
    return useQuery({
        queryKey: ['recentWorkspaces'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('workspaces')
                .select('id, name, avatar_url, updated_at, members_count')
                .order('last_accessed', { ascending: false })
                .limit(3);
            if (error) throw error;
            return data;
        },
    });
}

// Similar hooks for tasks, notifications, etc.