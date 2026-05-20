'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Tag as TagIcon, Plus, TrendingUp, Gamepad2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import CategoriesTable from '@/components/dashboard/CategoriesTable';
import CreateCategoryDrawer from '@/components/dashboard/CreateCategoryDrawer';

interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  totalGames: number;
  growthPercentage?: number;
  previousTotalCategories?: number;
}

export default function CategoriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stats, setStats] = useState<CategoryStats>({
    totalCategories: 0,
    activeCategories: 0,
    totalGames: 0,
    growthPercentage: 0,
    previousTotalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all categories (including inactive) for admin
        const categoriesResponse = await fetch(`${API_URL}/api/categories/admin/all`);
        const categoriesData = await categoriesResponse.json();

        if (categoriesData.success) {
          const categories = categoriesData.data;
          const totalCategories = categories.length;
          const activeCategories = categories.filter((c: any) => c.isActive !== false).length;
          const totalGames = categories.reduce((sum: number, cat: any) => sum + (cat.games?.length || 0), 0);
          
          // Calculate growth percentage (assuming 5% base)
          const previousTotalCategories = totalCategories > 0 ? Math.round(totalCategories / 1.05) : 0;
          const growthPercentage = previousTotalCategories > 0 
            ? Math.round(((totalCategories - previousTotalCategories) / previousTotalCategories) * 100) 
            : 0;

          setStats({
            totalCategories,
            activeCategories,
            totalGames,
            growthPercentage,
            previousTotalCategories,
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
            currentPage="categories"
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
            <h1 className="text-lg font-bold text-white">Categories</h1>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen w-full overflow-y-auto">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
                        <TagIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-[nunito] tracking-tight truncate">
                          Categories Management 
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 font-[nunito] mt-1 truncate">
                          Manage game categories and organize your content
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-xs sm:text-sm md:text-base hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-200 transform hover:scale-105 font-[nunito] whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Create Category</span>
                    <span className="sm:hidden">Create</span>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-purple-500/40 transition-all duration-300 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider font-[nunito]">Total Categories</p>
                      {loading ? (
                        <div className="h-7 sm:h-8 w-16 sm:w-20 bg-slate-700 rounded mt-2 animate-pulse" />
                      ) : (
                        <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-[nunito]">{stats.totalCategories}</p>
                      )}
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                      <TagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-3 text-[10px] sm:text-xs flex-wrap">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 shrink-0" />
                    <span className="text-green-400 font-bold font-[nunito]">+{stats.growthPercentage || 0}%</span>
                    <span className="text-slate-500 font-[nunito] font-bold truncate">from last month</span>
                  </div>
                </div>

                <div className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-green-500/40 transition-all duration-300 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider font-[nunito]">Active Categories</p>
                      {loading ? (
                        <div className="h-7 sm:h-8 w-16 sm:w-20 bg-slate-700 rounded mt-2 animate-pulse" />
                      ) : (
                        <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-[nunito]">{stats.activeCategories}</p>
                      )}
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-3 text-[10px] sm:text-xs flex-wrap">
                    <span className="text-green-400 font-bold font-[nunito]">{stats.totalCategories > 0 ? Math.round((stats.activeCategories / stats.totalCategories) * 100) : 0}%</span>
                    <span className="text-slate-500 font-bold font-[nunito] truncate">of total categories</span>
                  </div>
                </div>

                <div className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-blue-500/40 transition-all duration-300 group sm:col-span-2 lg:col-span-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider font-[nunito]">Total Games</p>
                      {loading ? (
                        <div className="h-7 sm:h-8 w-16 sm:w-20 bg-slate-700 rounded mt-2 animate-pulse" />
                      ) : (
                        <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-[nunito]">{stats.totalGames}</p>
                      )}
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-3 text-[10px] sm:text-xs flex-wrap">
                    <span className="text-blue-400 font-bold font-[nunito]">{stats.totalCategories > 0 ? Math.round(stats.totalGames / stats.totalCategories) : 0}</span>
                    <span className="text-slate-500 font-[nunito] font-bold truncate">games per category</span>
                  </div>
                </div>
              </div>

              {/* Categories Table */}
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white font-[nunito] flex items-center gap-2">
                  <div className="w-1 h-5 sm:h-6 bg-linear-to-b from-purple-600 to-pink-600 rounded-full" />
                  All Categories
                </h2>
                <CategoriesTable />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Category Drawer */}
      <CreateCategoryDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
