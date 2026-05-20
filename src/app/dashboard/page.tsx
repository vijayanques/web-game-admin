'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/components/pages/Dashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
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
              currentPage="dashboard"
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
              <h1 className="text-lg font-bold text-white">Dashboard</h1>
              <div className="w-10" />
            </div>

            <Dashboard />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
