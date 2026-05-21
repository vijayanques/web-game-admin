'use client';

import { useState } from 'react';
import { Image, Settings as SettingsIcon } from 'lucide-react';
import LogosManager from '@/components/dashboard/LogosManager';

type SettingsTab = 'branding';

const tabs: { id: SettingsTab; label: string; icon: typeof Image; description: string }[] = [
  {
    id: 'branding',
    label: 'Logo Management',
    icon: Image,
    description: 'Upload and manage header & footer logos',
  },
];

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('branding');

  return (
    <div className="space-y-6">
      {/* Settings header card */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-600/20">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-[nunito]">Site Settings</h2>
            <p className="mt-1 text-sm text-slate-400 font-[nunito]">
              Configure branding and site-wide preferences for your admin panel.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tab navigation */}
        <nav className="lg:w-56 shrink-0">
          <ul className="space-y-1 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <span className="block text-sm font-semibold font-[nunito]">{tab.label}</span>
                      <span className={`block text-xs mt-0.5 font-[nunito] ${isActive ? 'text-purple-100' : 'text-slate-500'}`}>
                        {tab.description}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tab content */}
        <div className="min-w-0 flex-1">
          {activeTab === 'branding' && (
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4 sm:p-6 backdrop-blur-sm">
              <div className="mb-6 border-b border-slate-700/50 pb-4">
                <h3 className="text-xl font-bold text-white font-[nunito]">Logo Management</h3>
                <p className="mt-1 text-sm text-slate-400 font-[nunito]">
                  Manage your header and footer logos displayed on the website.
                </p>
              </div>
              <LogosManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
