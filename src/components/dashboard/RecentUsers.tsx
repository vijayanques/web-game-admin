'use client';

import { useQuery } from '@tanstack/react-query';
import { User, Mail, Calendar, Zap } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface RecentUser {
  id: number;
  username: string;
  email: string;
  created_at?: string;
  last_login_at?: string;
}

const fetchRecentUsers = async (): Promise<RecentUser[]> => {
  try {
    const response = await apiClient.get('/api/users?limit=10&sort=created_at&order=desc');
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

export default function RecentUsers() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['recentUsers'],
    queryFn: fetchRecentUsers,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-purple-500/30 transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-linear-to-r from-slate-900 to-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-purple-600 to-pink-600 rounded-full" />
            Recent Users
          </h3>
          <span className="text-xs text-slate-400">{users.length} users</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Username</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <User className="w-8 h-8 text-slate-600" />
                    <p className="text-slate-400 text-sm">No users yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                    index % 2 === 0 ? 'bg-slate-800/20' : ''
                  }`}
                >
                  {/* Username */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-white truncate">
                        {user.username || 'Unknown'}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>{formatDate(user.created_at)}</span>
                    </div>
                  </td>

                  {/* Last Login */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300">{formatDate(user.last_login_at)}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {users.length > 0 && (
        <div className="px-6 py-3 border-t border-slate-700 bg-slate-800/50">
          <button className=" cursor-pointer text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
            View All Users →
          </button>
        </div>
      )}
    </div>
  );
}
