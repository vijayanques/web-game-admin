'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bug, CheckCircle, Clock, AlertCircle, Search, Filter, Image as ImageIcon, X } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BugReportsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['bugReports'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/bug-reports`);
      return res.json();
    },
    refetchInterval: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, adminMessage }: any) => {
      const res = await fetch(`${API_BASE_URL}/api/bug-reports/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminMessage }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugReports'] });
      setSelectedReport(null);
    },
  });

  const reports = response?.data || [];

  const filteredReports = reports.filter((r: any) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reports.filter((r: any) => r.status === 'Pending').length;
  const inProgressCount = reports.filter((r: any) => r.status === 'In Progress').length;
  const resolvedCount = reports.filter((r: any) => r.status === 'Resolved').length;

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateStatus) return;
    updateMutation.mutate({
      id: selectedReport.id,
      status: updateStatus,
      adminMessage: adminNote
    });
  };

  const getStatusColor = (status: string) => {
    if (status === 'Pending') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (status === 'In Progress') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (status === 'Resolved') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Pending') return <AlertCircle className="w-4 h-4" />;
    if (status === 'In Progress') return <Clock className="w-4 h-4" />;
    if (status === 'Resolved') return <CheckCircle className="w-4 h-4" />;
    return <Bug className="w-4 h-4" />;
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <div className="w-64 hidden lg:block h-full shrink-0">
        <Sidebar currentPage="bug-reports" />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0B0F19] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3 font-[nunito]">
                <Bug className="w-8 h-8 text-rose-500" />
                Issue Tracking
              </h1>
              <p className="text-slate-400 mt-2 font-[nunito]">Manage and resolve user-reported bugs and issues.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <h4 className="text-slate-400 text-sm font-semibold font-[nunito]">Total Reports</h4>
                <p className="text-3xl font-black text-white font-[nunito] mt-1">{reports.length}</p>
              </div>
              <div className="bg-slate-900 border border-rose-500/20 rounded-2xl p-5 shadow-lg">
                <h4 className="text-rose-400 text-sm font-semibold font-[nunito]">Pending</h4>
                <p className="text-3xl font-black text-white font-[nunito] mt-1">{pendingCount}</p>
              </div>
              <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-5 shadow-lg">
                <h4 className="text-amber-400 text-sm font-semibold font-[nunito]">In Progress</h4>
                <p className="text-3xl font-black text-white font-[nunito] mt-1">{inProgressCount}</p>
              </div>
              <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-5 shadow-lg">
                <h4 className="text-emerald-400 text-sm font-semibold font-[nunito]">Resolved</h4>
                <p className="text-3xl font-black text-white font-[nunito] mt-1">{resolvedCount}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex flex-col sm:flex-row p-4 gap-4 justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search by title or user..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-colors w-full font-[nunito]"
                />
              </div>
              <div className="flex bg-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto">
                {['All', 'Pending', 'In Progress', 'Resolved'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterStatus(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold font-[nunito] transition-all whitespace-nowrap ${
                      filterStatus === tab 
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">Bug Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider font-[nunito]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {isLoading ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading reports...</td></tr>
                    ) : filteredReports.length > 0 ? filteredReports.map((report: any) => (
                      <tr key={report.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                              {report.imageUrl ? <ImageIcon className="w-5 h-5 text-cyan-400" /> : <Bug className="w-5 h-5 text-slate-500" />}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white font-[nunito] line-clamp-1">{report.title}</div>
                              <div className="text-xs text-slate-500 font-[nunito] line-clamp-1 mt-0.5">{report.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-slate-300 font-[nunito]">{report.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                            {getStatusIcon(report.status)}
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{new Date(report.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-slate-500">{new Date(report.createdAt).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => {
                              setSelectedReport(report);
                              setUpdateStatus(report.status);
                              setAdminNote('');
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-colors font-[nunito]"
                          >
                            View & Update
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="text-center py-12 text-slate-500 font-[nunito]">No bug reports found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modal Overlay */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <h2 className="text-xl font-black text-white font-[nunito] flex items-center gap-2">
                <Bug className="w-6 h-6 text-rose-500" />
                Report Details
              </h2>
              <button onClick={() => setSelectedReport(null)} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              
              {/* User Report Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-[nunito]">{selectedReport.title}</h3>
                  <p className="text-sm text-slate-400 font-[nunito] mt-1">Reported by <span className="text-cyan-400 font-bold">{selectedReport.username}</span> on {new Date(selectedReport.createdAt).toLocaleString()}</p>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-[nunito]">
                    {selectedReport.description}
                  </p>
                </div>

                {selectedReport.imageUrl && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 mb-2 font-[nunito]">Attached Image</h4>
                    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img src={selectedReport.imageUrl} alt="Bug report attachment" className="w-full max-h-[400px] object-contain" />
                    </div>
                  </div>
                )}
              </div>

              {/* Status Update Form */}
              <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-4 font-[nunito]">Update Status</h4>
                <form onSubmit={handleUpdateStatus} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-[nunito]">Status</label>
                    <select 
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-colors font-[nunito]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-[nunito]">Admin Note (sent to timeline)</label>
                    <textarea 
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="E.g., We have identified the issue and are working on a fix..."
                      className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-colors font-[nunito] h-24 resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-3 rounded-xl transition-colors font-[nunito] disabled:opacity-50"
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Update Report Status'}
                  </button>
                </form>
              </div>

              {/* History Timeline */}
              {selectedReport.history && selectedReport.history.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-white mb-4 font-[nunito]">Activity History</h4>
                  <div className="space-y-4 border-l-2 border-slate-800 ml-3 pl-5 relative">
                    {selectedReport.history.map((item: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[27px] w-3 h-3 rounded-full border-2 border-slate-900 ${
                          item.status === 'Pending' ? 'bg-rose-500' :
                          item.status === 'In Progress' ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`} />
                        <p className="text-xs text-slate-500 font-[nunito] mb-1">{new Date(item.timestamp).toLocaleString()}</p>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 inline-block">
                          <span className={`text-xs font-bold mb-1 block ${
                            item.status === 'Pending' ? 'text-rose-400' :
                            item.status === 'In Progress' ? 'text-amber-400' :
                            'text-emerald-400'
                          }`}>{item.status}</span>
                          <p className="text-sm text-slate-300 font-[nunito]">{item.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
