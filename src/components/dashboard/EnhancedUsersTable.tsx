'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, Eye, Edit2, Trash2, ChevronDown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  gamePlayed: string;
  status: 'active' | 'idle' | 'offline';
  joinDate: string;
  playtime: string;
  avatar?: string;
}

const users: User[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@example.com', gamePlayed: 'Cyber Rush', status: 'active', joinDate: '2024-01-15', playtime: '24h 30m', avatar: 'AJ' },
  { id: '2', name: 'Sarah Williams', email: 'sarah@example.com', gamePlayed: 'Galaxy Quest', status: 'active', joinDate: '2024-02-20', playtime: '18h 15m', avatar: 'SW' },
  { id: '3', name: 'Mike Chen', email: 'mike@example.com', gamePlayed: 'Dragon Legends', status: 'idle', joinDate: '2024-01-10', playtime: '42h 45m', avatar: 'MC' },
  { id: '4', name: 'Emma Davis', email: 'emma@example.com', gamePlayed: 'Puzzle Master', status: 'active', joinDate: '2024-03-05', playtime: '12h 20m', avatar: 'ED' },
  { id: '5', name: 'James Wilson', email: 'james@example.com', gamePlayed: 'Racing Thunder', status: 'offline', joinDate: '2024-01-25', playtime: '56h 10m', avatar: 'JW' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa@example.com', gamePlayed: 'Cyber Rush', status: 'active', joinDate: '2024-02-14', playtime: '31h 50m', avatar: 'LA' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'idle':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'offline':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return '';
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500 animate-pulse';
    case 'idle':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-red-500';
    default:
      return '';
  }
};

export default function EnhancedUsersTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'idle' | 'offline'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [activeStatusMenu, setActiveStatusMenu] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hasNoResults = filteredUsers.length === 0;

  const handleStatusChange = (userId: string, newStatus: 'active' | 'idle' | 'offline') => {
    // This would update the user status in a real app
    console.log(`Changed user ${userId} status to ${newStatus}`);
    setActiveStatusMenu(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-linear-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 relative z-0">
        {/* Search */}
        <div className="flex-1 relative z-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border font-[nunito] border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>

        {/* Date Filter */}
        <div className="relative z-0">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
        {hasNoResults ? (
          // Empty State
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Users Found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider w-1/4">User</th>
                  <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider w-1/5">Email</th>
                  <th className="hidden lg:table-cell px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider w-1/6">Game</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider w-1/6">Status</th>
                  <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider w-1/6">Playtime</th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-slate-700 hover:bg-slate-700/50 transition-all duration-200 group ${index === filteredUsers.length - 1 ? 'border-b-0' : ''
                      }`}
                  >
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                          {user.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate User font-[nunito]">{user.name}</p>
                          <p className="text-slate-500 text-xs truncate font-[nunito]">{user.joinDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-4 py-3">
                      <p className="text-slate-300 text-sm truncate font-[nunito]">{user.email}</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-slate-300 text-sm font-[nunito]">{user.gamePlayed}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setActiveStatusMenu(activeStatusMenu === user.id ? null : user.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer hover:shadow-lg ${getStatusColor(user.status)}`}
                        >
                          <div className={`w-2 h-2 rounded-full font-[nunito] ${getStatusDot(user.status)}`} />
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {/* Status Menu */}
                        {activeStatusMenu === user.id && (
                          <div className="absolute top-full left-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20">
                            {['active', 'idle', 'offline'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(user.id, status as any)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center gap-2 border-b border-slate-700 last:border-b-0 hover:bg-slate-700 ${user.status === status
                                  ? 'bg-purple-600/20 text-purple-400'
                                  : 'text-slate-300'
                                  }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' :
                                  status === 'idle' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`} />
                                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                {user.status === status && (
                                  <span className="ml-auto text-xs">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-4 py-3">
                      <span className="text-slate-400 text-sm font-medium font-[nunito]">{user.playtime}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
        
                        <button className="p-2 hover:bg-slate-600 rounded-lg transition-all duration-200 hover:scale-110" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!hasNoResults && (
          <div className="px-3 sm:px-4 py-3 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between text-xs sm:text-sm text-slate-400">
            <span className='font-[nunito]'>Showing {filteredUsers.length} of {users.length} users</span>
            <button className=" font-[nunito] text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              View All →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
