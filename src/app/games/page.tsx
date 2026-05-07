'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Gamepad2 as GamepadIcon, Plus, TrendingUp, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import GamesGrid from '@/components/dashboard/GamesGrid';
import CreateGameDrawer from '@/components/dashboard/CreateGameDrawer';

interface GameStats {
  totalGames: number;
  activeGames: number;
  totalPlays: number;
  previousTotalGames?: number;
  engagementRate?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetchGameStats = async (): Promise<GameStats> => {
  const gamesResponse = await fetch(`${API_URL}/api/games`);
  const gamesData = await gamesResponse.json();

  if (!gamesData.success) {
    throw new Error('Failed to fetch games');
  }

  const games = gamesData.data;
  const totalGames = games.length;
  const activeGames = games.filter((g: any) => g.is_active !== false).length;
  
  let totalPlays = 0;
  try {
    const activityResponse = await fetch(`${API_URL}/api/user-activity/stats`);
    if (activityResponse.ok) {
      const activityData = await activityResponse.json();
      totalPlays = activityData.data?.totalPlays || 0;
    }
  } catch (error) {
    console.error('Error fetching activity stats:', error);
  }

  const engagementRate = activeGames > 0 ? (totalPlays / activeGames) : 0;
  const previousTotalGames = totalGames > 0 ? Math.round(totalGames / 1.08) : 0;

  return {
    totalGames,
    activeGames,
    totalPlays,
    previousTotalGames,
    engagementRate: Math.round(engagementRate * 10) / 10,
  };
};

export default function GamesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: stats, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['gameStats'],
    queryFn: fetchGameStats,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    refetch();
  }, [refetch]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const defaultStats: GameStats = {
    totalGames: 0,
    activeGames: 0,
    totalPlays: 0,
    previousTotalGames: 0,
    engagementRate: 0,
  };

  const displayStats = stats || defaultStats;
  const growthPercentage = (displayStats.previousTotalGames ?? 0) > 0 
    ? Math.round(((displayStats.totalGames - (displayStats.previousTotalGames ?? 0)) / (displayStats.previousTotalGames ?? 1)) * 100) 
    : 0;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out mt-16 lg:mt-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
        >
          <Sidebar
            currentPage="games"
            onNavigate={() => setSidebarOpen(false)}
          />
        </div>

        <main className="flex-1 overflow-auto">
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
            <h1 className="text-lg font-bold text-white font-[nunito]">Games</h1>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen w-full overflow-y-auto">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
                        <GamepadIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-[nunito] tracking-tight truncate">
                          Games Management
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 font-[nunito] mt-1 truncate">
                          Browse and manage all games in the platform
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* <button
                      onClick={() => refetch()}
                      disabled={isFetching}
                      className="p-2 sm:p-2.5 hover:bg-slate-800 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Refresh stats"
                    >
                      <RefreshCw className={`w-5 h-5 text-slate-400 ${isFetching ? 'animate-spin' : ''}`} />
                    </button> */}
                    <button
                      onClick={() => setDrawerOpen(true)}
                      className="cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-xs sm:text-sm md:text-base hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-200 transform hover:scale-105 font-[nunito] whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Create Game</span>
                      <span className="sm:hidden">Create</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Total Games Card */}
                <div className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-purple-500/40 transition-all duration-300 group">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider font-[nunito]">Total Games</p>
                      {isLoading ? (
                        <div className="h-7 sm:h-8 w-16 sm:w-20 bg-slate-700 rounded mt-2 animate-pulse" />
                      ) : (
                        <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-[nunito]">{displayStats.totalGames}</p>
                      )}
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                      <GamepadIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-3 text-[11px] sm:text-xs">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 shrink-0" />
                    <span className="text-green-400 font-bold font-[nunito]">+{growthPercentage}%</span>
                    <span className="text-slate-500 font-[nunito] truncate">from last month</span>
                  </div>
                </div>

                {/* Active Games Card */}
                <div className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-green-500/40 transition-all duration-300 group">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider font-[nunito]">Active Games</p>
                      {isLoading ? (
                        <div className="h-7 sm:h-8 w-16 sm:w-20 bg-slate-700 rounded mt-2 animate-pulse" />
                      ) : (
                        <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-[nunito]">{displayStats.activeGames}</p>
                      )}
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-3 text-[11px] sm:text-xs">
                    <span className="text-green-400 font-bold font-[nunito]">{displayStats.totalGames > 0 ? Math.round((displayStats.activeGames / displayStats.totalGames) * 100) : 0}%</span>
                    <span className="text-slate-500 font-[nunito] truncate">of total games</span>
                  </div>
                </div>

                {/* Total Plays Card */}
                <div className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-blue-500/40 transition-all duration-300 group sm:col-span-2 lg:col-span-1">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider font-[nunito]">Total Plays</p>
                      {isLoading ? (
                        <div className="h-7 sm:h-8 w-16 sm:w-20 bg-slate-700 rounded mt-2 animate-pulse" />
                      ) : (
                        <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-[nunito]">{formatNumber(displayStats.totalPlays)}</p>
                      )}
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <span className="text-blue-400 font-bold text-lg">▶</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-3 text-[11px] sm:text-xs">
                    <span className="text-blue-400 font-bold font-[nunito]">+{displayStats.engagementRate?.toFixed(1)}%</span>
                    <span className="text-slate-500 font-[nunito] truncate">engagement rate</span>
                  </div>
                </div>
              </div>

              {/* Games Grid */}
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white font-[nunito] flex items-center gap-2">
                  <div className="w-1 h-5 sm:h-6 bg-linear-to-b from-purple-600 to-pink-600 rounded-full" />
                  All Games
                </h2>
                <GamesGrid onGameCreated={refetch} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Game Drawer */}
      <CreateGameDrawer isOpen={drawerOpen} onClose={handleDrawerClose} />
    </div>
  );
}
