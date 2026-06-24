import { useQuery } from '@tanstack/react-query';
import { GetWorkspaceTimeSpent } from './services';

export function useWorkspaceTimeSpent() {
    return useQuery({
        queryKey: ['workspace_time_spent'],
        queryFn: async () => {
            const res = await GetWorkspaceTimeSpent();
            if (res.success && res.data) {
                return res.data;
            }
            return [];
        },
    });
}
