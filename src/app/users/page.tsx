'use client';

import { Users as UsersIcon } from 'lucide-react';
import UsersTable from '@/components/dashboard/UsersTable';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out mt-16 lg:mt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <Sidebar
            currentPage="users"
            onNavigate={(page) => {
              setSidebarOpen(false);
            }}
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl  font-bold text-white mb-1 sm:mb-2 flex items-center gap-3">
                      <div className=" font-[nunito] w-10 h-10 bg-linear-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-white" />
                      </div>
                      Users
                    </h1>
                    <p className=" font-[nunito] text-sm sm:text-base text-slate-400">Manage and view all users in the system.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-linear-to-b from-blue-600 to-blue-400 rounded-full font-[nunito]" />
                  Recent Users
                </h2>
                <UsersTable />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
