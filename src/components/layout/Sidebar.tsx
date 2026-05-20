"use client";

import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Gamepad2, Tag, LogOut, FileText, Activity, Bug, Image } from 'lucide-react';
import { logoutAdmin } from '@/lib/api/auth';

interface SidebarProps {
  currentPage?: 'dashboard' | 'create-game' | 'users' | 'games' | 'categories' | 'pages' | 'ads' | 'traffic' | 'bug-reports' | 'logos';
  onNavigate?: (page: 'dashboard' | 'create-game' | 'users' | 'games' | 'categories' | 'pages' | 'ads' | 'traffic' | 'bug-reports' | 'logos') => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'users', label: 'Users', icon: Users, href: '/users' },
    { id: 'games', label: 'Games', icon: Gamepad2, href: '/games' },
    { id: 'categories', label: 'Categories', icon: Tag, href: '/categories' },
    { id: 'pages', label: 'Page SEO', icon: FileText, href: '/pages' },
    { id: 'logos', label: 'Logo Management', icon: Image, href: '/logos' },
    { id: 'ads', label: 'Ads Management', icon: Tag, href: '/ads' },
    { id: 'traffic', label: 'Traffic Analytics', icon: Activity, href: '/traffic' },
    { id: 'bug-reports', label: 'Bug Reports', icon: Bug, href: '/bug-reports' },
  ];

  const handleNavigate = (href: string, page: 'dashboard' | 'create-game' | 'users' | 'games' | 'categories' | 'pages' | 'ads' | 'traffic' | 'bug-reports' | 'logos') => {
    router.push(href);
    onNavigate?.(page);
  };

  return (
    <aside className="w-full h-full bg-slate-900 border-r border-slate-800 flex flex-col">
   

      {/* Menu Items */}
      <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.href, item.id as 'dashboard' | 'create-game' | 'users' | 'games' | 'categories' | 'pages' | 'ads' | 'traffic' | 'bug-reports' | 'logos')}
              className={` cursor-pointer w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              <Icon className="w-5 h-5 shrink-0 cursor-pointer" />
              <span className="font-medium text-sm sm:text-base cursor-pointer">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 sm:p-4 border-t border-slate-800">
        <button
          onClick={async () => {
            await logoutAdmin();
            router.push('/login');
          }}
          className="text-center cursor-pointer w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium text-sm sm:text-base shadow-lg shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-600/40 transition-all duration-200 group hover:scale-105"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
