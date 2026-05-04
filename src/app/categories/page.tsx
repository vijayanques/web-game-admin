'use client';

import { useState } from 'react';
import { Menu, X, Tag as TagIcon, Plus } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import CategoriesTable from '@/components/dashboard/CategoriesTable';
import CreateCategoryDrawer from '@/components/dashboard/CreateCategoryDrawer';

export default function CategoriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
            <h1 className="text-lg font-bold text-white">GameAdmin</h1>
            <div className="w-10" />
          </div>

          <div className="flex-1">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl  font-bold text-white mb-1 sm:mb-2 flex items-center gap-3">
                      <div className=" font-[nunito]  w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <TagIcon className="w-5 h-5 text-white" />
                      </div>
                      Categories
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 font-[nunito]  ">Manage game categories and organize your content.</p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="  cursor-pointer flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 cursor-pointer" />
                    <span className="hidden sm:inline font-[nunito] cursor-pointer  ">Create Category</span>
                    <span className="sm:hidden font-[nunito] ">Create</span>
                  </button>
                </div>
              </div>

              {/* Categories Table */}
              <CategoriesTable />
            </div>
          </div>
        </main>
      </div>

      {/* Create Category Drawer */}
      <CreateCategoryDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
