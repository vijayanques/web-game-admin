
// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { Users, Gamepad2, Zap, TrendingUp, AlertCircle } from 'lucide-react';
// import SummaryCard from '@/components/dashboard/SummaryCard';
// import UserGrowthChart from '@/components/charts/UserGrowthChart';
// import ActivePlayersChart from '@/components/charts/ActivePlayersChart';
// import RecentUsers from '@/components/dashboard/RecentUsers';
// import { fetchDashboardData } from '@/lib/api/dashboard';

// export default function Dashboard() {
//   const { data: dashboardData, isLoading, error } = useQuery({
//     queryKey: ['dashboard'],
//     queryFn: fetchDashboardData,
//     staleTime: 10000,
//     retry: 3,
//     retryDelay: 1000,
//     enabled: typeof window !== 'undefined',
//   });

//   if (isLoading) {
//     return (
//       <div className="p-8 min-h-screen bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
//           <p className="text-slate-400 mb-4">
//             {error instanceof Error ? error.message : 'Unknown error'}
//           </p>
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
//       </div>

//       {/* Key Metrics */}
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

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <UserGrowthChart data={dashboardData.userGrowthChart} />
//         <ActivePlayersChart data={dashboardData.activePlayersChart} />
//       </div>

//       {/* Recent Users */}
//       <div>
//         <RecentUsers />
//       </div>
//     </div>
//   );
// }




'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Gamepad2, Zap, TrendingUp, AlertCircle, LayoutDashboard } from 'lucide-react';
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
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
          </div>
          <p className="text-slate-400 font-medium text-sm tracking-wide">Loading dashboard...</p>
          <div className="flex gap-1 justify-center mt-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1 h-1 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-8 min-h-screen bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-slate-900/80 border border-red-500/30 rounded-2xl">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load</h2>
          <p className="text-slate-400 text-sm">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  const { stats } = dashboardData;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 overflow-hidden">
      {/* Ambient floating orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 rounded-full bg-purple-600/8 blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="fixed bottom-20 right-10 w-80 h-80 rounded-full bg-pink-600/6 blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/4 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-xl" />
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight truncate">
                  Dashboard
                </h1>
                <p className="text-slate-400 text-xs sm:text-[13px] mt-1 sm:mt-1.5 font-semibold font-[nunito] truncate">Real-time analytics & insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section label ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-purple-500/40 to-transparent" />
          <span className="text-[11px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-[nunito] whitespace-nowrap">Key Metrics</span>
          <div className="h-px flex-1 bg-linear-to-l from-purple-500/40 to-transparent" />
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          <SummaryCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            trend={`${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}%`}
            trendUp={stats.userGrowth > 0}
            color="from-blue-600 to-cyan-400"
            subtitle="Registered accounts"
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
            color="from-emerald-600 to-teal-400"
            subtitle="Playing now"
          />
        </div>

        {/* ── Section label ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-purple-500/40 to-transparent" />
          <span className="text-[11px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-[nunito] whitespace-nowrap">Analytics</span>
          <div className="h-px flex-1 bg-linear-to-l from-purple-500/40 to-transparent" />
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          <UserGrowthChart data={dashboardData.userGrowthChart} />
          <ActivePlayersChart data={dashboardData.activePlayersChart} />
        </div>

        {/* ── Section label ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-purple-500/40 to-transparent" />
          <span className="text-[11px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-[nunito] whitespace-nowrap">Recent Activity</span>
          <div className="h-px flex-1 bg-linear-to-l from-purple-500/40 to-transparent" />
        </div>

        {/* ── Recent Users ── */}
        <RecentUsers />

      </div>
    </div>
  );
}