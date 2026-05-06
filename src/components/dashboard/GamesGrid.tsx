


'use client';

import { useState } from 'react';
import { Star, Eye as WatchIcon, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function GamesGrid() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | undefined>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | undefined>();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Fetch games
  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteGame,
    onSuccess: () => {
      toast.success('Game deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['games'] });
      setDeleteModalOpen(false);
      setGameToDelete(undefined);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete game');
    },
  });

  const categories = ['all', ...new Set(games.map(g => g.category?.name || g.genre).filter(Boolean))];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryName = game.category?.name || game.genre;
    const matchesCategory = categoryFilter === 'all' || categoryName === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
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
  };

  const handleEditClick = (game: Game) => {
    setSelectedGame(game);
    setUpdateDrawerOpen(true);
  };

  const handleDeleteClick = (game: Game) => {
    setGameToDelete(game);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!gameToDelete) return;
    deleteMutation.mutate(gameToDelete.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer text-white"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-slate-400 font-[nunito]">
          Showing {filteredGames.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, filteredGames.length)} of {filteredGames.length} games
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filteredGames.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400 font-[nunito]">No games found</p>
          </div>
        ) : (
          paginatedGames.map(game => (
            <div
              key={game.id}
              className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <div
                className="h-32 sm:h-36 relative bg-cover bg-center bg-slate-800"
                style={game.thumbnail ? { backgroundImage: `url(${game.thumbnail})` } : {}}
              >
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent" />

                {/* <div className="absolute top-2 right-2 bg-black/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-[nunito]">{game.rating.toFixed(1)}</span>
                </div> */}

                {!game.isActive && (
                  <div className="absolute top-2 left-2 bg-red-600 px-1.5 py-0.5 rounded">
                    <span className="text-white text-[10px] font-bold font-[nunito]">INACTIVE</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 sm:p-3 space-y-2">
                <h3 className="text-white text-sm font-bold font-[nunito] truncate">{game.title}</h3>
                <p className="text-slate-400 text-xs font-[nunito] truncate">{game.category?.name || game.genre}</p>

                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => handleEditClick(game)}
                    className="font-[nunito] flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-700 rounded text-white text-xs hover:bg-slate-600 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span className="hidden sm:inline cursor-pointer">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(game)}
                    className="font-[nunito] flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-600/20 rounded text-red-400 text-xs hover:bg-red-600/30 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="hidden sm:inline cursor-pointer  ">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredGames.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2">
          {/* Page Info */}
          <div className="text-sm text-slate-400 font-[nunito]">
            Page {currentPage} of {totalPages}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition-all ${
                currentPage === 1
                  ? 'border-slate-700 text-slate-600 cursor-not-allowed'
                  : 'border-slate-600 text-white hover:bg-slate-800 hover:border-purple-500'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`min-w-[36px] h-9 px-3 rounded-lg font-[nunito] text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
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
              className={`p-2 rounded-lg border transition-all ${
                currentPage === totalPages
                  ? 'border-slate-700 text-slate-600 cursor-not-allowed'
                  : 'border-slate-600 text-white hover:bg-slate-800 hover:border-purple-500'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Update Game Drawer */}
      <UpdateGameDrawer
        isOpen={updateDrawerOpen}
        onClose={() => setUpdateDrawerOpen(false)}
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