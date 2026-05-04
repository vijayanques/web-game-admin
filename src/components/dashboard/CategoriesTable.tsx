'use client';

import { useState } from 'react';
import { Search, Edit2, Trash2, Loader } from 'lucide-react';
import UpdateCategoryDrawer from './UpdateCategoryDrawer';
import DeleteCategoryModal from './DeleteCategoryModal';
import { useCategories } from '@/lib/hooks/useCategories';
import { Category } from '@/lib/api/categories';

export default function CategoriesTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | undefined>();

  const { data: categories = [], isLoading, isError, error } = useCategories();

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? cat.isActive : !cat.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setUpdateDrawerOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
        <p className="text-red-400 font-semibold">Failed to load categories</p>
        <p className="text-red-300 text-sm mt-2">
          {error instanceof Error ? error.message : 'An error occurred'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-linear-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="font-[nunito] w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-slate-900"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className=" cursor-pointer px-4 py-2.5 font-[nunito] bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-slate-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm">
                <th className="font-[nunito] px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="font-[nunito] hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-3 font-[nunito] sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Games
                </th>
                <th className="px-3 sm:px-6 font-[nunito] py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 font-[nunito] py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                      <span className="text-slate-400">Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <p className="text-slate-400">No categories found</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category.id}
                    className={`border-b border-slate-700 hover:bg-slate-700/50 transition-all duration-200 group ${index === filteredCategories.length - 1 ? 'border-b-0' : ''
                      }`}
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {category.icon || category.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm sm:text-base truncate">
                            {category.name}
                          </p>
                          <p className="text-slate-500 text-xs hidden sm:block">
                            Created {new Date(category.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                      <p className="text-slate-300 text-sm truncate">{category.description}</p>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="text-slate-300 text-sm font-medium">
                        {category.games?.length || 0}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                            }`}
                        />
                        <span
                          className={`text-xs font-semibold ${category.isActive ? 'text-green-400' : 'text-slate-400'
                            }`}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 cursor-pointer text-yellow-400 hover:text-yellow-300 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-300 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between text-xs sm:text-sm text-slate-400">
          <span>
            Showing {filteredCategories.length} of {categories.length} categories
          </span>
          <button className="text-purple-400 cursor-pointer hover:text-purple-300 font-semibold transition-colors">
            View All →
          </button>
        </div>
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
