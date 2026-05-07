'use client';

import { useState } from 'react';
import { Search, Edit2, Trash2, Loader, ChevronDown, Gamepad2, Sword, Shield, Car, Rocket, Target, Crosshair, Puzzle, Dices, Flame, Zap, Crown, Trophy, Star, Sparkles, Heart, Ghost, Skull, Bomb, Wand2, Users, Brain, Lightbulb, Smile, Wind, Waves, Mountain, Flower, Gem, Compass, Map, Castle, Tent, Cloud, Sun, Moon, Droplet, Leaf, Trees, Bird, Fish, Anchor, Activity, Cpu, Database, Server, Wifi, Radio, Tv, Monitor, Smartphone, Camera, Video, Film, Music, Palette, Book, Tag } from 'lucide-react';
import UpdateCategoryDrawer from './UpdateCategoryDrawer';
import DeleteCategoryModal from './DeleteCategoryModal';
import { useCategories } from '@/lib/hooks/useCategories';
import { Category } from '@/lib/api/categories';
import { categoryAPI } from '@/lib/api/categories';

// Icon mapping for dynamic display
const iconComponents: Record<string, any> = {
  Gamepad2, Sword, Shield, Car, Rocket, Target, Crosshair, Puzzle, Dices, Flame, Zap, Crown, Trophy, Star, Sparkles, Heart, Ghost, Skull, Bomb, Wand2, Users, Brain, Lightbulb, Smile, Wind, Waves, Mountain, Flower, Gem, Compass, Map, Castle, Tent, Cloud, Sun, Moon, Droplet, Leaf, Trees, Bird, Fish, Anchor, Activity, Cpu, Database, Server, Wifi, Radio, Tv, Monitor, Smartphone, Camera, Video, Film, Music, Palette, Book, Tag
};

export default function CategoriesTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'games' | 'date'>('name');
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | undefined>();
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<number, boolean>>({});

  const { data: categories = [], isLoading, isError, error, refetch } = useCategories();

  // Get icon component dynamically
  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName || !iconComponents[iconName]) {
      return Gamepad2; // Default icon
    }
    return iconComponents[iconName];
  };

  const filteredCategories = categories
    .map(cat => ({
      ...cat,
      // Apply optimistic update if exists
      isActive: optimisticUpdates[cat.id] !== undefined ? optimisticUpdates[cat.id] : cat.isActive
    }))
    .filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? cat.isActive : !cat.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'games') return (b.games?.length || 0) - (a.games?.length || 0);
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setUpdateDrawerOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleToggleStatus = async (category: Category) => {
    const newStatus = !category.isActive;
    
    // Optimistic update - change UI immediately
    setOptimisticUpdates(prev => ({ ...prev, [category.id]: newStatus }));
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Direct fetch call without FormData for simple status toggle
      const response = await fetch(`${API_URL}/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          isActive: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      // Success - keep the optimistic update permanently
      // Don't clear it, the change is now saved on the backend
      
    } catch (error) {
      console.error('Error toggling category status:', error);
      
      // Revert optimistic update on error only
      setOptimisticUpdates(prev => {
        const updated = { ...prev };
        delete updated[category.id];
        return updated;
      });
      
      alert('Failed to update category status. Please try again.');
    }
  };

  if (isError) {
    return (
      <div className="bg-linear-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-8 text-center backdrop-blur-sm">
        <p className="text-red-400 font-bold text-lg font-[nunito]">Failed to load categories</p>
        <p className="text-red-300 text-sm mt-2 font-[nunito]">
          {error instanceof Error ? error.message : 'An error occurred'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-linear-to-r from-slate-900/50 via-slate-900/40 to-slate-800/50 border border-slate-700/60 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none shrink-0" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-[nunito] w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 sm:px-4 py-2 sm:py-2.5 font-[nunito] bg-slate-800/50 border border-slate-600/50 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all min-w-0"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'games' | 'date')}
            className="px-3 sm:px-4 py-2 sm:py-2.5 font-[nunito] bg-slate-800/50 border border-slate-600/50 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all min-w-0"
          >
            <option value="name">Sort by Name</option>
            <option value="games">Sort by Games</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-linear-to-br from-slate-900/60 via-slate-900/40 to-slate-800/60 border border-slate-700/60 rounded-lg sm:rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="text-center">
              <Loader className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 animate-spin mx-auto mb-3" />
              <p className="text-slate-400 font-[nunito] text-sm">Loading categories...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCategories.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 font-[nunito] text-base sm:text-lg">No categories found</p>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-[nunito]">Try adjusting your filters</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && filteredCategories.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-slate-700/60 bg-linear-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm">
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                    Category
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                    Description
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                    Games
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => (
                  <tr
                    key={category.id}
                    className={`border-b border-slate-700/40 hover:bg-slate-800/40 transition-all duration-200 group ${
                      index === filteredCategories.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    {/* Category Name */}
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-600/30">
                          {(() => {
                            const IconComponent = getIconComponent(category.icon);
                            return <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />;
                          })()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold text-xs sm:text-sm truncate font-[nunito]">
                            {category.name}
                          </p>
                          <p className="text-slate-500 text-[10px] sm:text-xs hidden sm:block font-[nunito]">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <p className="text-slate-300 text-xs sm:text-sm truncate font-[nunito]">
                        {category.description || '-'}
                      </p>
                    </td>

                    {/* Games Count */}
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                      <div className="inline-flex items-center justify-center">
                        <span className="text-purple-300 text-xs sm:text-sm font-bold font-[nunito]">
                          {category.games?.length || 0}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <div
                          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                            category.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                        <span
                          className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider font-[nunito] ${
                            category.isActive ? 'text-green-400' : 'text-slate-400'
                          }`}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleToggleStatus(category)}
                          className={`relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-offset-slate-900 shrink-0 ${
                            category.isActive 
                              ? 'bg-linear-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-600/30' 
                              : 'bg-slate-700'
                          }`}
                          title={category.isActive ? 'Click to deactivate' : 'Click to activate'}
                        >
                          <span
                            className={`inline-block h-3.5 sm:h-4 w-3.5 sm:w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                              category.isActive ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleEditClick(category)}
                          className="p-1.5 sm:p-2 hover:bg-yellow-500/20 rounded-lg transition-all duration-200 hover:scale-110 group/btn shrink-0"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 group-hover/btn:text-yellow-300" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110 group/btn shrink-0"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 group-hover/btn:text-red-300" />
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
        {!isLoading && filteredCategories.length > 0 && (
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-linear-to-r from-slate-800/40 to-slate-800/20 border-t border-slate-700/60 flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
            <span className="font-[nunito]">
              Showing <span className="text-purple-400 font-bold">{filteredCategories.length}</span> of{' '}
              <span className="text-purple-400 font-bold">{categories.length}</span> categories
            </span>
          </div>
        )}
      </div>

      {/* Update Category Drawer */}
      <UpdateCategoryDrawer
        isOpen={updateDrawerOpen}
        onClose={() => setUpdateDrawerOpen(false)}
        category={selectedCategory}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        categoryName={categoryToDelete?.name || ''}
        categoryId={categoryToDelete?.id}
      />
    </div>
  );
}
