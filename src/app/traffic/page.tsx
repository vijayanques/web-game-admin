"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import TrafficChart from '@/components/charts/TrafficChart';
import {
  Activity, Users, UserCheck, PlayCircle, CheckCircle2,
  Smartphone, Monitor, Laptop, Chrome, Compass,
  Globe, Clock, Search, Filter
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function TrafficPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: trafficData, isLoading } = useQuery({
    queryKey: ['trafficStats'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/traffic/stats`);
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  const recentActivities = trafficData?.recentActivity || [];
  const stats = trafficData?.stats || { pageVisits: 0, totalVisitors: 0, onlineUsers: 0, gamesStarted: 0, gamesCompleted: 0, avgSessionTime: '0m 0s' };
  const devices = trafficData?.devices || { mobile: 0, desktop: 0, other: 0 };
  const browsers = trafficData?.browsers || { chrome: 0, safari: 0, firefox: 0, edge: 0, other: 0 };

  // Filtering and Pagination
  const filteredActivities = recentActivities.filter((activity: any) =>
    (activity.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (activity.page || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (activity.ipAddress || '').includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalDevices = (devices.mobile + devices.desktop + devices.other) || 1;
  const totalBrowsers = (browsers.chrome + browsers.safari + browsers.firefox + browsers.edge + browsers.other) || 1;

  const StatCard = ({ title, value, change, icon: Icon, colorClass }: any) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-slate-400 text-sm font-semibold font-[nunito]">{title}</h4>
        <p className="text-2xl font-black text-white font-[nunito] mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <div className="w-64 hidden lg:block h-full shrink-0">
        <Sidebar currentPage="traffic" />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0B0F19] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3 font-[nunito]">
                <Activity className="w-8 h-8 text-cyan-400" />
                Traffic & Analytics
              </h1>
              <p className="text-slate-400 mt-2 font-[nunito]">Monitor user activity, device stats, and session traffic in real-time.</p>
            </div>

            {/* 1. Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard title="Page Visits" value={stats.pageVisits.toLocaleString()} change="" icon={Globe} colorClass="bg-blue-500" />
              <StatCard title="Total Visitors" value={stats.totalVisitors.toLocaleString()} change="" icon={Users} colorClass="bg-purple-500" />
              <StatCard title="Online Users" value={stats.onlineUsers.toLocaleString()} change="Live" icon={UserCheck} colorClass="bg-emerald-500" />
              <StatCard title="Games Started" value={stats.gamesStarted.toLocaleString()} change="" icon={PlayCircle} colorClass="bg-orange-500" />
              <StatCard title="Games Completed" value={stats.gamesCompleted.toLocaleString()} change="" icon={CheckCircle2} colorClass="bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 2. Device Analytics */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6 font-[nunito] flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" /> Device Analytics
                </h3>
                <div className="space-y-5">
                  {[
                    { label: 'Mobile Users', value: `${Math.round((devices.mobile / totalDevices) * 100)}%`, count: devices.mobile.toLocaleString(), icon: Smartphone, color: 'bg-indigo-500' },
                    { label: 'Desktop Users', value: `${Math.round((devices.desktop / totalDevices) * 100)}%`, count: devices.desktop.toLocaleString(), icon: Monitor, color: 'bg-sky-500' },
                    { label: 'Other Devices', value: `${Math.round((devices.other / totalDevices) * 100)}%`, count: devices.other.toLocaleString(), icon: Laptop, color: 'bg-slate-500' },
                  ].map(device => (
                    <div key={device.label} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-2 text-slate-300 font-[nunito]">
                          <device.icon className="w-4 h-4 text-slate-500" /> {device.label}
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold block">{device.value}</span>
                          <span className="text-xs text-slate-500">{device.count}</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className={`h-full ${device.color} rounded-full group-hover:brightness-110 transition-all`} style={{ width: device.value }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Browser Analytics */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6 font-[nunito] flex items-center gap-2">
                  <Chrome className="w-5 h-5 text-rose-400" /> Browser Analytics
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Chrome', value: `${Math.round((browsers.chrome / totalBrowsers) * 100)}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Safari', value: `${Math.round((browsers.safari / totalBrowsers) * 100)}%`, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                    { label: 'Firefox', value: `${Math.round((browsers.firefox / totalBrowsers) * 100)}%`, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                    { label: 'Edge', value: `${Math.round((browsers.edge / totalBrowsers) * 100)}%`, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  ].map(browser => (
                    <div key={browser.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${browser.bg} flex items-center justify-center`}>
                          <Compass className={`w-4 h-4 ${browser.color}`} />
                        </div>
                        <span className="text-slate-200 font-medium font-[nunito]">{browser.label}</span>
                      </div>
                      <span className="text-white font-bold">{browser.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Session Analytics */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6 font-[nunito] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" /> Session Analytics
                </h3>
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-800/30 rounded-xl border border-slate-700/50 p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 relative z-10">
                    <Clock className="w-10 h-10 text-amber-400" />
                  </div>
                  <p className="text-slate-400 font-[nunito] mb-1 relative z-10">Average Session Time</p>
                  <h2 className="text-4xl font-black text-white tracking-tight relative z-10">{stats.avgSessionTime || '0m 0s'}</h2>
                  <p className="text-emerald-400 text-sm font-semibold mt-2 relative z-10 flex items-center gap-1">
                    <span>Average per user</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Traffic & 7. Charts Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-[nunito]">Traffic Overview</h3>
                  <p className="text-slate-400 text-sm font-[nunito]">Visitors and page views over time</p>
                </div>

                <div className="flex bg-slate-800 p-1 rounded-xl">
                  {(['daily', 'weekly', 'monthly'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold font-[nunito] capitalize transition-all ${activeTab === tab
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Render dynamic chart based on activeTab */}
              <div className="grid grid-cols-1 gap-6">
                <TrafficChart type={activeTab} chartData={trafficData?.charts?.dailyData} />
              </div>
            </div>

            {/* 6. Recent Users Activity Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-[nunito]">Recent User Activity</h3>
                  <p className="text-slate-400 text-sm mt-1 font-[nunito]">Live stream of user interactions</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                      className="bg-slate-800 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-cyan-500 transition-colors w-full sm:w-64"
                    />
                  </div>
                  {/* <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button> */}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">Username / IP</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">Page</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">System info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">Action</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">Time / Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {paginatedActivities.length > 0 ? paginatedActivities.map((activity: any) => (
                      <tr key={activity.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                              {(activity.username || 'G').substring(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white font-[nunito]">{activity.username || 'Guest'}</div>
                              {/* <div className="text-xs text-slate-500 font-mono">{activity.ipAddress}</div> */}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-300 font-medium bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                            /{activity.page}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                              {activity.device === 'mobile' ? <Smartphone size={12} /> : activity.device === 'desktop' ? <Monitor size={12} /> : <Laptop size={12} />}
                              <span className="capitalize">{activity.device}</span>
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                              <Compass size={12} />
                              <span className="capitalize">{activity.browser}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${activity.action === 'game_started' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            activity.action === 'game_completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                            {activity.action === 'game_started' && <PlayCircle size={12} />}
                            {activity.action === 'game_completed' && <CheckCircle2 size={12} />}
                            {activity.action === 'page_view' && <Globe size={12} />}
                            {activity.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">
                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-500 font-[nunito]">No recent activity found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <div className="text-sm text-slate-400 font-[nunito]">
                  Showing {filteredActivities.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(filteredActivities.length, currentPage * itemsPerPage)} of {filteredActivities.length} entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 font-[nunito] text-sm font-semibold transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="cursor-pointer px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 font-[nunito] text-sm font-semibold transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
