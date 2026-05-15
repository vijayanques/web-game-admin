'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronDown, Bell, Search, Zap } from 'lucide-react';
import { logoutAdmin } from '@/lib/api/auth';

export default function Navbar() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="relative bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
      {/* Left side - Logo */}
      <div className="flex items-center gap-3 group">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
          <div className="relative w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-600/50 group-hover:shadow-purple-600/70 transition-all duration-300 group-hover:scale-105">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="hidden lg:block">
          <h2 className="text-lg font-bold text-white font-[nunito] tracking-tight">Gaming Platform</h2>
          <p className="text-xs text-slate-400 font-[nunito]">Admin Dashboard</p>
        </div>
      </div>



      {/* Right side - Actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        {/* <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-all duration-200 group">
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full border-2 border-slate-900 animate-pulse" />
        </button> */}

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all duration-200 group"
          >
            <div className=" cursor-pointer w-8 h-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-600/50 group-hover:shadow-purple-600/70 transition-all">
              AD
            </div>
            <div className="hidden sm:block text-left cursor-pointer">
              <p className="text-sm font-semibold text-white font-[nunito]">Admin</p>
              <p className="text-xs text-slate-400 font-[nunito]">Super Admin</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-all duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-slate-800 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl shadow-purple-600/10 z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-700 bg-linear-to-r from-slate-800 to-transparent">
                <p className="text-sm font-semibold text-white font-[nunito]">Admin User</p>
                <p className="text-xs text-slate-400 mt-1 font-[nunito]">admin@gameplatform.com</p>
              </div>
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 cursor-pointer py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-all duration-200 rounded-lg group font-[nunito]"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
