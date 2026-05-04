'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Gamepad2 as GamepadIcon, Plus } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import GamesGrid from '@/components/dashboard/GamesGrid';
import CreateGameDrawer from '@/components/dashboard/CreateGameDrawer';

interface GameStats {
  totalGames: number;
  activeGames: number;
  totalPlays: number;
}

export default function GamesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    activeGames: 0,
    totalPlays: 0,
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch games to calculate stats
        const gamesResponse = await fetch(`${API_URL}/api/games`);
        const gamesData = await gamesResponse.json();

        if (gamesData.success) {
          const games = gamesData.data;
          const totalGames = games.length;
          const activeGames = games.filter((g: any) => g.is_active !== false).length;
          
          // Fetch user activity for total plays
          const activityResponse = await fetch(`${API_URL}/api/user-activity/stats`);
          let totalPlays = 0;
          
          if (activityResponse.ok) {
            const activityData = await activityResponse.json();
            totalPlays = activityData.data?.totalPlays || 0;
          }

          setStats({
            totalGames,
            activeGames,
            totalPlays,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_URL]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

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
            <h1 className="text-lg font-bold text-white">GameAdmin</h1>
            <div className="w-10" />
          </div>

          <div className="flex-1">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl  font-bold text-white mb-1 sm:mb-2 flex items-center gap-3">
                      <div className=" font-[nunito]  w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <GamepadIcon className="w-5 h-5 text-white" />
                      </div>
                      Games
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 font-[nunito]  ">Browse and manage all games in the platform.</p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className=" cursor-pointer flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline font-[nunito] ">Create Game</span>
                    <span className="sm:hidden font-[nunito] ">Create</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-linear-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1 font-[nunito] ">Total Games</p>
                    {loading ? (
                      <div className="h-7 w-16 mx-auto bg-slate-700 rounded animate-pulse" />
                    ) : (
                      <p className="text-lg sm:text-xl font-bold text-purple-400 font-[nunito] ">{stats.totalGames}</p>
                    )}
                  </div>
                  <div className="text-center border-l border-slate-700">
                    <p className="text-xs text-slate-500 mb-1 font-[nunito] ">Active</p>
                    {loading ? (
                      <div className="h-7 w-16 mx-auto bg-slate-700 rounded animate-pulse" />
                    ) : (
                      <p className="text-lg sm:text-xl font-bold text-green-400 font-[nunito] ">{stats.activeGames}</p>
                    )}
                  </div>
                  <div className="text-center border-l border-slate-700">
                    <p className="text-xs text-slate-500 mb-1 font-[nunito] ">User plays</p>
                    {loading ? (
                      <div className="h-7 w-16 mx-auto bg-slate-700 rounded animate-pulse" />
                    ) : (
                      <p className="text-lg sm:text-xl font-bold text-blue-400 font-[nunito] ">{formatNumber(stats.totalPlays)}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <GamesGrid />
            </div>
          </div>
        </main>
      </div>

      {/* Create Game Drawer */}
      <CreateGameDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
