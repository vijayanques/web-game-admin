'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Trophy, Play, Search, ArrowUpRight, BarChart3, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface TrendingGame {
  id: number;
  title: string;
  totalPlays: number;
  todayPlays: number;
  trendingScore: number;
  category?: {
    name: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function TrendingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: trendingGames = [], isLoading, refetch } = useQuery({
    queryKey: ['trendingGamesAdmin'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/games/trending`);
      const result = await response.json();
      return result.data || [];
    },
  });

  const filteredGames = trendingGames.filter((game: TrendingGame) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResetStats = async () => {
    if (!confirm('Are you sure you want to manually reset today\'s plays? This will clear trending scores.')) return;

    try {
      // We would need a backend route for this. Let's assume it exists or I'll add it.
      const response = await fetch(`${API_BASE_URL}/admin/reset-trending`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Trending stats reset successfully');
        refetch();
      } else {
        toast.error('Failed to reset stats');
      }
    } catch (error) {
      toast.error('Error resetting stats');
    }
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <TrendingUp className="text-purple-500" />
            Trending Analytics
          </h1>
          <p className="text-slate-400 mt-1">Monitor real-time game popularity and player engagement.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleResetStats}
            className="px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-600/20 transition-colors font-bold text-sm"
          >
            Reset Daily Stats
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4 text-slate-400">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Total Top Game</span>
          </div>
          <div className="text-4xl font-black text-white">
            {trendingGames[0]?.title || 'N/A'}
          </div>
          <p className="text-slate-500 text-sm mt-2">Rank #1 based on trending score</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4 text-slate-400">
            <Play className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Today's Plays</span>
          </div>
          <div className="text-4xl font-black text-purple-500">
            {trendingGames.reduce((acc: number, g: TrendingGame) => acc + g.todayPlays, 0).toLocaleString()}
          </div>
          <p className="text-slate-500 text-sm mt-2">Combined plays for top 20 games</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4 text-slate-400">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Avg Score</span>
          </div>
          <div className="text-4xl font-black text-emerald-500">
            {(trendingGames.reduce((acc: number, g: TrendingGame) => acc + g.trendingScore, 0) / (trendingGames.length || 1)).toFixed(1)}
          </div>
          <p className="text-slate-500 text-sm mt-2">Trending threshold for featured list</p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Game Name</th>
                <th className="px-6 py-4 text-right">Today's Plays</th>
                <th className="px-6 py-4 text-right">Total Plays</th>
                <th className="px-6 py-4 text-right">Trending Score</th>
                <th className="px-6 py-4">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredGames.map((game: TrendingGame, index: number) => (
                <tr key={game.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                        index === 1 ? 'bg-slate-300/20 text-slate-300' :
                          index === 2 ? 'bg-orange-500/20 text-orange-500' :
                            'bg-slate-800 text-slate-500'
                      }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{game.title}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-emerald-500 font-mono">+{game.todayPlays.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">{game.totalPlays.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-black text-purple-400">{game.trendingScore.toFixed(1)}</span>
                      <ArrowUpRight className="w-3 h-3 text-purple-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase font-bold">
                      {game.category?.name || 'General'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
