import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData, type DashboardData } from '@/lib/api/dashboard';

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
}
