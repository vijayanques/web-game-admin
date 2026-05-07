'use client';

import { useState, useCallback, useMemo } from 'react';
import { Edit2, Trash2, Search, ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import UpdateGameDrawer from './UpdateGameDrawer';
import DeleteGameModal from './DeleteGameModal';
import { Game } from '@/lib/api/games';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.118:8000';

const fetchGames = async (): Promise<Game[]> => {
  const response = await fetch(`${API_BASE_URL}/api/games`);
  const data = await response.json();
  if (!data.success) {
    throw new Error('Failed to fetch games');
  }
  return data.data;
};

const deleteGame = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/games/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to delete game');
  }
  return data;
};

interface GamesGridProps {
  onGameCreated?: () => void;
}

export default function GamesGrid({ onGameCreated }: GamesGridProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | undefined>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const { data: games = [], isLoading, refetch } = useQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGame,
    onSuccess: () => {
      toast.success('Game deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['gameStats'] });
      setDeleteModalOpen(false);
      setGameToDelete(undefined);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete game');
    },
  });

  // Memoized categories
  const categories = useMemo(() => {
    const cats = new Set(games.map(g => g.category?.name || g.genre).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [games]);

  // Memoized filtered games
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryName = game.category?.name || game.genre;
      const matchesCategory = categoryFilter === 'all' || categoryName === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  }, []);

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const handleEditClick = useCallback((game: Game) => {
    setSelectedGame(game);
    setUpdateDrawerOpen(true);
  }, []);

  const handleDeleteClick = useCallback((game: Game) => {
    setGameToDelete(game);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!gameToDelete) return;
    deleteMutation.mutate(gameToDelete.id);
  }, [gameToDelete, deleteMutation]);

  const handleUpdateDrawerClose = useCallback(() => {
    setUpdateDrawerOpen(false);
    setSelectedGame(undefined);
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg sm:rounded-xl p-8 sm:p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 animate-spin" />
          <p className="text-slate-400 font-[nunito] text-sm">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-linear-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2 md:gap-3 overflow-hidden">
        {/* Search Input */}
        <div className="flex-1 relative group min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors pointer-events-none shrink-0" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-slate-500 font-[nunito]"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="cursor-pointer w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-slate-500 font-[nunito]"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Items Per Page */}
        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="cursor-pointer w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-slate-500 font-[nunito]"
        >
          <option value={6}>6 per page</option>
          <option value={12}>12 per page</option>
          <option value={24}>24 per page</option>
          <option value={48}>48 per page</option>
        </select>
      </div>

      {/* Results Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2">
        <p className="text-xs sm:text-sm text-slate-400 font-[nunito]">
          Showing <span className="text-white font-bold font-[nunito]">{filteredGames.length === 0 ? 0 : startIndex + 1}</span> - <span className="text-white font-bold font-[nunito]">{Math.min(endIndex, filteredGames.length)}</span> of <span className="text-white font-bold font-[nunito]">{filteredGames.length}</span> games
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {filteredGames.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400 font-[nunito] text-sm">No games found</p>
          </div>
        ) : (
          paginatedGames.map(game => (
            <div
              key={game.id}
              className="group bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/20 hover:scale-[1.02]"
            >
              {/* Game Thumbnail */}
              <div
                className="h-32 sm:h-40 relative bg-cover bg-center bg-slate-800 overflow-hidden"
                style={game.thumbnail ? { backgroundImage: `url(${game.thumbnail})` } : {}}
              >
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />

                {/* Status Badge */}
                {!game.isActive && (
                  <div className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
                    <span className="text-white text-[10px] sm:text-xs font-bold font-[nunito]">INACTIVE</span>
                  </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEditClick(game)}
                    className="p-2 sm:p-2.5 cursor-pointer bg-linear-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-600/50 rounded-lg hover:shadow-purple-600/70 transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(game)}
                    className="p-2 sm:p-2.5 bg-red-600 cursor-pointer hover:bg-red-700 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Game Info */}
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="min-w-0">
                  <h3 className="text-white text-xs sm:text-sm font-bold font-[nunito] truncate group-hover:text-purple-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-slate-400 text-[10px] sm:text-xs font-[nunito] font-bold truncate mt-0.5 sm:mt-1">
                    {game.category?.name || game.genre}
                  </p>
                </div>

                {/* Game Stats */}
                <div className="flex items-center gap-1.5 sm:gap-2 font-semibold text-[10px] sm:text-xs text-slate-500 font-[nunito]">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span className="truncate">Added recently</span>
                </div>

                {/* Action Buttons (Mobile) */}
                <div className="flex gap-1.5 sm:gap-2 pt-2 sm:hidden">
                  <button
                    onClick={() => handleEditClick(game)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400 text-[10px] font-bold transition-colors font-[nunito]"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(game)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-[10px] font-bold transition-colors font-[nunito]"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredGames.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 pb-2">
          {/* Page Info */}
          <div className="text-xs sm:text-sm text-slate-400 font-[nunito]">
            Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer shrink-0 ${currentPage === 1
                ? 'border-slate-700 text-slate-600 cursor-not-allowed'
                : 'border-slate-600 text-white hover:bg-slate-800 hover:border-purple-500'
                }`}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-slate-500 text-xs sm:text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`cursor-pointer min-w-7 sm:min-w-9 h-7 sm:h-9 px-2 sm:px-3 rounded-lg font-[nunito] text-xs sm:text-sm font-medium transition-all ${currentPage === page
                      ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:border-purple-500'
                      }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`cursor-pointer p-1.5 sm:p-2 rounded-lg border transition-all shrink-0 ${currentPage === totalPages
                ? 'border-slate-700 text-slate-600 cursor-not-allowed'
                : 'border-slate-600 text-white hover:bg-slate-800 hover:border-purple-500'
                }`}
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Update Game Drawer */}
      <UpdateGameDrawer
        isOpen={updateDrawerOpen}
        onClose={handleUpdateDrawerClose}
        game={selectedGame}
      />

      {/* Delete Game Modal */}
      <DeleteGameModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        gameName={gameToDelete?.title || ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
