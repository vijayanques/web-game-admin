'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronDown, Zap } from 'lucide-react';
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
    <nav className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl shadow-lg shadow-purple-600/5">
      {/* Left side - Title */}
      <div className="hidden lg:block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-600/50">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Gaming Platform</h2>
            <p className="text-xs text-slate-400">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800/80 rounded-lg transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-600/50 group-hover:shadow-purple-600/70 transition-all">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-white cursor-pointer">Admin</p>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors cursor-pointer">Super Admin</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-all duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-purple-600/10 z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-700/50 bg-linear-to-r from-slate-800/50 to-transparent">
                <p className="text-sm font-semibold text-white cursor-pointer">Admin User</p>
                <p className="text-xs text-slate-400 mt-1 cursor-pointer">admin@gameplatform.com</p>
              </div>
              <div className="py-2">
                {/* <button className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700/50 cursor-pointer hover:text-purple-300 flex items-center gap-3 transition-all duration-200 group">
                  <User className="w-4 h-4 group-hover:text-purple-400 transition-colors cursor-pointer" />
                  Profile
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700/50 cursor-pointer hover:text-purple-300 flex items-center gap-3 transition-all duration-200 group">
                  <Settings className="w-4 h-4 group-hover:text-purple-400 transition-colors cursor-pointer" />
                  Settings
                </button> */}
              </div>
              <div className="border-t border-slate-700/50 p-2">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 cursor-pointer hover:text-red-300 flex items-center gap-3 transition-all duration-200 rounded group"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform cursor-pointer" />
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
