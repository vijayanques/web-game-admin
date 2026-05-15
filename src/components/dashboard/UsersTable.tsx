"use client";

import { useState, useEffect } from 'react';
import { Trash2, Search, Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteUserModal from './DeleteUserModal';

interface User {
  id: number;
  username: string;
  email: string;
  score?: number;
  level?: number;
  created_at?: string;
  updated_at?: string;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'idle':
      return 'Idle';
    case 'offline':
      return 'Offline';
    default:
      return '';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'idle':
      return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    case 'offline':
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    default:
      return '';
  }
};

const getUserStatus = (lastLoginAt?: string): 'active' | 'idle' | 'offline' => {
  if (!lastLoginAt) return 'offline';

  const lastLogin = new Date(lastLoginAt);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastLogin.getTime()) / (1000 * 60);

  if (diffMinutes < 5) return 'active';
  if (diffMinutes < 30) return 'idle';
  return 'offline';
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'idle' | 'offline'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/users`);
        const data = await response.json();

        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.message || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_URL]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, sortBy]);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const userStatus = getUserStatus(user.updated_at);
    const matchesStatus = statusFilter === 'all' || userStatus === statusFilter;

    const matchesDate = !dateFilter ||
      (user.created_at && user.created_at.startsWith(dateFilter));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.username.localeCompare(b.username);
    } else if (sortBy === 'date') {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    } else {
      const statusA = getUserStatus(a.updated_at);
      const statusB = getUserStatus(b.updated_at);
      return statusA.localeCompare(statusB);
    }
  });

  // Pagination logic
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setDeleteModalOpen(false);
        setUserToDelete(undefined);
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-[nunito] text-sm">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-red-700/50 rounded-xl p-8 flex items-center justify-center">
        <p className="text-red-400 font-[nunito] text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 placeholder:font-[nunito] font-semibold bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-slate-500 font-[nunito]"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'idle' | 'offline')}
          className="cursor-pointer px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-slate-500 font-[nunito]"
        >
          <option value="all" className='font-[nunito]'>All Status</option>
          <option value="active" className='font-[nunito]'>Active</option>
          <option value="idle" className='font-[nunito]'>Idle</option>
          <option value="offline" className='font-[nunito]'>Offline</option>
        </select>

        {/* Date Filter */}
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors pointer-events-none" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="cursor-pointer pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-slate-500 font-[nunito] [&::-webkit-calendar-picker-indicator]:opacity-40 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'status')}
          className="cursor-pointer px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-slate-500 font-[nunito]"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm">
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                  User
                </th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                  Email
                </th>
                <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                  Level
                </th>
                <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                  Score
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                  Joined
                </th>
                <th className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 sm:px-6 py-8 text-center">
                    <p className="text-slate-400 font-[nunito]">No users found</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user: User, index: number) => {
                  const userStatus = getUserStatus(user.updated_at);
                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-slate-700 hover:bg-slate-700/50 transition-all duration-200 group ${index === paginatedUsers.length - 1 ? 'border-b-0' : ''
                        }`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 bg-linear-to-br from-purple-500 font-[nunito] to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-sm truncate font-[nunito]">
                              {user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
                        <p className="text-slate-400 text-sm truncate font-[nunito]">
                          {user.email}
                        </p>
                      </td>
                      <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <span className="text-slate-300 text-sm font-[nunito]">
                            Level {user.level || 1}
                          </span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                        <span className="text-slate-400 text-sm font-medium font-[nunito]">
                          {user.score || 0}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${userStatus === 'active' ? 'bg-green-500 animate-pulse' :
                              userStatus === 'idle' ? 'bg-yellow-500' :
                                'bg-slate-500'
                            }`} />
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(userStatus)} font-[nunito]`}>
                            {getStatusLabel(userStatus)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-slate-400 text-sm font-[nunito]">
                          {formatDate(user.created_at)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 hover:bg-slate-600 rounded-lg transition-all duration-200 hover:scale-110 group/btn"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:text-red-300 cursor-pointer" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 sm:px-6 py-4 bg-slate-800/50 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400 font-[nunito]">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <span>Showing <span className="text-white font-bold">{Math.min(startIndex + 1, totalItems)}</span> to <span className="text-white font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-white font-bold">{totalItems}</span> users</span>
          </div>
          
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1 mx-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                      currentPage === pageNum 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.username || ''}
        isLoading={isDeleting}
      />
    </div>
  );
}