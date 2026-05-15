'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Calendar, Zap, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';

interface RecentUser {
  id: number;
  username: string;
  email: string;
  created_at?: string;
  last_login_at?: string;
}

const fetchRecentUsers = async (): Promise<RecentUser[]> => {
  try {
    const response = await apiClient.get('/api/users?limit=50&sort=created_at&order=desc');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return [];
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

const AVATAR_COLORS = [
  'from-purple-600 to-pink-600',
  'from-blue-600 to-cyan-500',
  'from-emerald-600 to-teal-500',
  'from-orange-500 to-pink-500',
  'from-violet-600 to-indigo-500',
];

export default function RecentUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['recentUsers'],
    queryFn: fetchRecentUsers,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // Pagination logic
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_50px_rgba(139,92,246,0.15)]">

      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top glow bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/70 to-transparent" />

      {/* Header */}
      <div className="relative px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-slate-700/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-purple-500/20 animate-ping opacity-40" />
              <div className="relative w-8 sm:w-9 h-8 sm:h-9 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center ">
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white font-[nunito] truncate">Recent Users</h3>
              <p className="text-slate-400 text-[12px] sm:text-[13px] font-[nunito] font-semibold truncate">Latest registrations</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-800 border border-slate-700 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold text-slate-300 font-[nunito] whitespace-nowrap">{users.length} total</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest font-[nunito]">User</span>
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left hidden sm:table-cell">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest font-[nunito]">Email</span>
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left hidden md:table-cell">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest font-[nunito]">Joined</span>
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest font-[nunito]">Active</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-700/30">
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-slate-700 animate-pulse shrink-0" />
                      <div className="h-3 w-20 sm:w-24 rounded bg-slate-700 animate-pulse" />
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden sm:table-cell"><div className="h-3 w-32 rounded bg-slate-700 animate-pulse" /></td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell"><div className="h-3 w-16 rounded bg-slate-700 animate-pulse" /></td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4"><div className="h-3 w-16 rounded bg-slate-700 animate-pulse" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 sm:py-14 text-center">
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <User className="w-6 sm:w-7 h-6 sm:h-7 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium">No users registered yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index: number) => (
                <tr
                  key={user.id}
                  className="group/row border-b border-slate-700/30 hover:bg-purple-500/5 transition-all duration-200 cursor-pointer"
                >
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className={`absolute inset-0 rounded-lg sm:rounded-xl bg-linear-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} font-[nunito] opacity-0 group-hover/row:opacity-40 blur-sm transition-opacity duration-300`} />
                        <div className={`relative w-7 sm:w-8 h-7 sm:h-8 bg-linear-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} font-[nunito] rounded-lg sm:rounded-xl flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-md`}>
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold font-[nunito] text-white group-hover/row:text-purple-300 transition-colors duration-200 truncate">
                        {user.username || 'Unknown'}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 group-hover/row:text-purple-400 transition-colors duration-200 shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-400 truncate max-w-xs font-[nunito]">{user.email}</span>
                    </div>
                  </td>

                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-400 font-[nunito]">{formatDate(user.created_at)}</span>
                    </div>
                  </td>

                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-400 animate-ping opacity-60" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-300 font-medium font-[nunito] truncate">{formatDate(user.last_login_at)}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination and View All */}
      {users.length > 0 && (
        <div className="relative px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-t border-slate-700/50 bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">


          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 cursor-pointer bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 font-[nunito]">
              Page <span className="text-white">{currentPage}</span> of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 cursor-pointer bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom glow bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
    </div>
  );
}