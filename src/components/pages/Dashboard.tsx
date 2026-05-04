

// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { Users, Gamepad2, Zap, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
// import SummaryCard from '@/components/dashboard/SummaryCard';
// import UserGrowthChart from '@/components/charts/UserGrowthChart';
// import ActivePlayersChart from '@/components/charts/ActivePlayersChart';
// import RecentUsers from '@/components/dashboard/RecentUsers';
// import { fetchDashboardData } from '@/lib/api/dashboard';

// export default function Dashboard() {
//   const { data: dashboardData, isLoading, error, refetch } = useQuery({
//     queryKey: ['dashboard'],
//     queryFn: fetchDashboardData,
//     refetchInterval: 30000,
//     staleTime: 10000,
//     retry: 3,
//     retryDelay: 1000,
//     enabled: typeof window !== 'undefined',
//   });

//   if (isLoading) {
//     return (
//       <div className="p-8 min-h-screen bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
//           <p className="text-slate-400">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !dashboardData) {
//     return (
//       <div className="p-8 min-h-screen bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-white mb-2">Failed to Load</h2>
//           <p className="text-slate-400 mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
//           <button
//             onClick={() => refetch()}
//             className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { stats } = dashboardData;

//   return (
//     <div className="p-8 space-y-8 bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
//             <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
//               <TrendingUp className="w-6 h-6 text-white" />
//             </div>
//             Dashboard
//           </h1>
//           <p className="text-slate-400">Real-time analytics and insights</p>
//         </div>
//         <button
//           onClick={() => refetch()}
//           className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
//         >
//           <RefreshCw className="w-4 h-4" />
//           Refresh
//         </button>
//       </div>

//       {/* Key Metrics - Real Data Only */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SummaryCard
//           title="Total Users"
//           value={stats.totalUsers.toLocaleString()}
//           icon={Users}
//           trend={`${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}%`}
//           trendUp={stats.userGrowth > 0}
//           color="from-blue-600 to-blue-400"
//           subtitle="Active users"
//         />
//         <SummaryCard
//           title="Total Games"
//           value={stats.totalGames.toLocaleString()}
//           icon={Gamepad2}
//           trend={`${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}%`}
//           trendUp={stats.userGrowth > 0}
//           color="from-purple-600 to-pink-400"
//           subtitle="Published"
//         />
//         <SummaryCard
//           title="Active Players"
//           value={stats.activePlayers.toLocaleString()}
//           icon={Zap}
//           trend={`${stats.playerRetention > 0 ? '+' : ''}${stats.playerRetention}%`}
//           trendUp={stats.playerRetention > 0}
//           color="from-green-600 to-emerald-400"
//           subtitle="Playing now"
//         />
//       </div>

//       {/* Charts and Recent Users */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <UserGrowthChart data={dashboardData.userGrowthChart} />
//         <ActivePlayersChart data={dashboardData.activePlayersChart} />
//       </div>

//       {/* Recent Users - Below Charts */}
//       <div>
//         <RecentUsers />
//       </div>
//     </div>
//   );
// }



'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Gamepad2, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import SummaryCard from '@/components/dashboard/SummaryCard';
import UserGrowthChart from '@/components/charts/UserGrowthChart';
import ActivePlayersChart from '@/components/charts/ActivePlayersChart';
import RecentUsers from '@/components/dashboard/RecentUsers';
import { fetchDashboardData } from '@/lib/api/dashboard';

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 10000,
    retry: 3,
    retryDelay: 1000,
    enabled: typeof window !== 'undefined',
  });

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-8 min-h-screen bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load</h2>
          <p className="text-slate-400 mb-4">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const { stats } = dashboardData;

  return (
    <div className="p-8 space-y-8 bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            Dashboard
          </h1>
          <p className="text-slate-400">Real-time analytics and insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={`${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}%`}
          trendUp={stats.userGrowth > 0}
          color="from-blue-600 to-blue-400"
          subtitle="Active users"
        />
        <SummaryCard
          title="Total Games"
          value={stats.totalGames.toLocaleString()}
          icon={Gamepad2}
          trend={`${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}%`}
          trendUp={stats.userGrowth > 0}
          color="from-purple-600 to-pink-400"
          subtitle="Published"
        />
        <SummaryCard
          title="Active Players"
          value={stats.activePlayers.toLocaleString()}
          icon={Zap}
          trend={`${stats.playerRetention > 0 ? '+' : ''}${stats.playerRetention}%`}
          trendUp={stats.playerRetention > 0}
          color="from-green-600 to-emerald-400"
          subtitle="Playing now"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart data={dashboardData.userGrowthChart} />
        <ActivePlayersChart data={dashboardData.activePlayersChart} />
      </div>

      {/* Recent Users */}
      <div>
        <RecentUsers />
      </div>
    </div>
  );
}