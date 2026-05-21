"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Check, X, Megaphone, Info, Link as LinkIcon, Image as ImageIcon, Menu } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { getAllAdConfigs, upsertAdConfig, deleteAdConfig, AdConfig } from '@/lib/api/adsense';
import toast from 'react-hot-toast';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

export default function AdsManagementPage() {
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', slot: '' });
  const [currentAd, setCurrentAd] = useState<Partial<AdConfig>>({
    slot: 'homepage_banner',
    adClient: '',
    adSlot: '',
    imageUrl: '',
    targetUrl: '',
    adType: 'static',
    responsive: true,
    status: true,
    allowedPages: ['home', 'game', 'category'],
  });

  const { data, isLoading } = useQuery({
    queryKey: ['adConfigs'],
    queryFn: getAllAdConfigs,
  });

  const upsertMutation = useMutation({
    mutationFn: upsertAdConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adConfigs'] });
      toast.success('Ad configuration saved successfully');
      setIsEditing(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error saving ad configuration');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adConfigs'] });
      toast.success('Ad configuration deleted successfully');
      setDeleteModal({ isOpen: false, id: '', slot: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error deleting ad configuration');
    },
  });

  const resetForm = () => {
    setCurrentAd({
      slot: 'homepage_banner',
      adClient: '',
      adSlot: '',
      imageUrl: '',
      targetUrl: '',
      adType: 'static',
      responsive: true,
      status: true,
      allowedPages: ['home', 'game', 'category'],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAd.slot) {
      toast.error('Slot name is required');
      return;
    }
    upsertMutation.mutate(currentAd as AdConfig);
  };

  const handleEdit = (ad: AdConfig) => {
    setCurrentAd({
      ...ad,
      allowedPages: ad.allowedPages || []
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string, slot: string) => {
    setDeleteModal({ isOpen: true, id, slot });
  };

  const adPlacements = [
    { value: 'header_image', label: 'Header Image' },
    { value: 'footer_image', label: 'Footer Image' },
    { value: 'homepage_banner', label: 'Homepage Top Banner' },
    { value: 'homepage_mid_banner_1', label: 'Homepage Mid Banner 1' },
    { value: 'homepage_mid_banner_2', label: 'Homepage Mid Banner 2' },
    { value: 'left_sidebar_ad', label: 'Left Sidebar Ad (Vertical)' },
    { value: 'right_sidebar_ad', label: 'Right Sidebar Ad (Vertical)' },
    { value: 'in_grid_ad_1', label: 'In-Grid Ad Card 1' },
    { value: 'in_grid_ad_2', label: 'In-Grid Ad Card 2' },
    { value: 'footer_ad', label: 'Footer Ad' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
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
        <Sidebar currentPage="ads" />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
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
            <h1 className="text-lg font-bold text-white">Ads Management</h1>
            <div className="w-10" />
          </div>

          <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Megaphone className="w-8 h-8 text-purple-500" />
                  Ads & Placements
                </h1>
                <p className="text-slate-400 mt-2">Manage future AdSense placements.</p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setIsEditing(true);
                }}
                className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-600/20"
              >
                <Plus className="w-5 h-5" />
                Add Placement
              </button>
            </div>

            {/* Add / Edit modal */}
            {isEditing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => { setIsEditing(false); resetForm(); }}
                  aria-hidden
                />
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="ad-placement-modal-title"
                  className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-900 pb-2 z-10">
                  <h2 id="ad-placement-modal-title" className="text-xl font-bold text-white">
                    {currentAd.id ? 'Edit Placement' : 'New Ad Placement'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); resetForm(); }}
                    className="p-2 hover:bg-slate-800 rounded-full text-slate-400"
                  >
                    <X className="cursor-pointer w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Ad Position / Slot</label>
                      <select
                        value={currentAd.slot}
                        onChange={(e) => setCurrentAd({ ...currentAd, slot: e.target.value })}
                        className="cursor-pointer w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      >
                        {adPlacements.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                        <option value="custom">Custom Position...</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Ad Type</label>
                      <select
                        value={currentAd.adType}
                        onChange={(e) => setCurrentAd({ ...currentAd, adType: e.target.value })}
                        className="cursor-pointer w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      >
                        <option value="static">Static Image Card</option>
                        <option value="promotional">Promotional Card</option>
                        <option value="adsense">Google AdSense (Future)</option>
                      </select>
                    </div>
                  </div>

                  {/* Static Ad Fields */}
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Static Content
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Image URL</label>
                        <input
                          type="text"
                          placeholder="https://example.com/ad-banner.jpg"
                          value={currentAd.imageUrl || ''}
                          onChange={(e) => setCurrentAd({ ...currentAd, imageUrl: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Target Link (OnClick)</label>
                        <input
                          type="text"
                          placeholder="https://your-promo-link.com"
                          value={currentAd.targetUrl || ''}
                          onChange={(e) => setCurrentAd({ ...currentAd, targetUrl: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AdSense Fields (Collapsed or Secondary) */}
                  <div className="bg-slate-800/10 p-4 rounded-xl border border-slate-800/50 space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Megaphone className="w-4 h-4" /> AdSense Config (Optional/Future)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Ad Client ID</label>
                        <input
                          type="text"
                          placeholder="ca-pub-xxxx"
                          value={currentAd.adClient || ''}
                          onChange={(e) => setCurrentAd({ ...currentAd, adClient: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-1.5 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Ad Slot ID</label>
                        <input
                          type="text"
                          placeholder="1234567"
                          value={currentAd.adSlot || ''}
                          onChange={(e) => setCurrentAd({ ...currentAd, adSlot: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-1.5 text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 py-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${currentAd.responsive ? 'bg-purple-600 border-purple-600' : 'border-slate-600 group-hover:border-slate-500'}`}>
                        {currentAd.responsive && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={currentAd.responsive}
                        onChange={(e) => setCurrentAd({ ...currentAd, responsive: e.target.checked })}
                      />
                      <span className="text-sm font-medium text-slate-300">Responsive Enabled</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${currentAd.status ? 'bg-emerald-600 border-emerald-600' : 'border-slate-600 group-hover:border-slate-500'}`}>
                        {currentAd.status && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={currentAd.status}
                        onChange={(e) => setCurrentAd({ ...currentAd, status: e.target.checked })}
                      />
                      <span className="text-sm font-medium text-slate-300">Active Status</span>
                    </label>
                  </div>

                  {/* Page Targeting */}
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> Target Pages
                    </h3>
                    <div className="flex flex-wrap gap-6">
                      {[
                        { id: 'home', label: 'Homepage' },
                        { id: 'game', label: 'Game Details' },
                        { id: 'category', label: 'Categories' },
                        { id: 'other', label: 'Other Pages' }
                      ].map(page => (
                        <label key={page.id} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${currentAd.allowedPages?.includes(page.id) ? 'bg-purple-600 border-purple-600' : 'border-slate-600 group-hover:border-slate-500'}`}>
                            {currentAd.allowedPages?.includes(page.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={currentAd.allowedPages?.includes(page.id)}
                            onChange={(e) => {
                              const pages = currentAd.allowedPages || [];
                              if (e.target.checked) {
                                setCurrentAd({ ...currentAd, allowedPages: [...pages, page.id] });
                              } else {
                                setCurrentAd({ ...currentAd, allowedPages: pages.filter(p => p !== page.id) });
                              }
                            }}
                          />
                          <span className="text-sm text-slate-300">{page.label}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 italic">If no pages are selected, the ad will show on all pages by default.</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); resetForm(); }}
                      className="cursor-pointer px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={upsertMutation.isPending}
                      className="cursor-pointer px-8 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
                    >
                      {upsertMutation.isPending ? 'Saving...' : 'Save Configuration'}
                    </button>
                  </div>
                </form>
                </div>
              </div>
            )}

            {/* List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white px-1">Active Placements</h2>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-40 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />
                  ))}
                </div>
              ) : data?.data?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.data.map((ad: AdConfig) => (
                    <div key={ad.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-lg capitalize">
                              {ad.slot.replace(/_/g, ' ')}
                            </h3>
                            {ad.status ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">Active</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">Inactive</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-md text-slate-400 capitalize">{ad.adType}</span>
                            {ad.targetUrl && (
                              <a href={ad.targetUrl} target="_blank" className="text-xs text-purple-400 hover:underline flex items-center gap-1">
                                <LinkIcon className="w-3 h-3" /> Link
                              </a>
                            )}
                            {ad.allowedPages && ad.allowedPages.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {ad.allowedPages.map(page => (
                                  <span key={page} className="text-[9px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500 uppercase tracking-tighter">
                                    {page}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(ad)}
                            className="cursor-pointer p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                          >
                            <Edit2 className="cursor-pointer w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ad.id!, ad.slot)}
                            className="cursor-pointer p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="cursor-pointer w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {ad.imageUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-slate-800 aspect-video relative group/img">
                          <img src={ad.imageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <span className="text-xs font-bold">Image Preview</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-12 text-center">
                  <Megaphone className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400">No ad placements configured yet.</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setIsEditing(true);
                    }}
                    className="cursor-pointer mt-4 text-purple-500 hover:text-purple-400 font-bold"
                  >
                    Create your first placement
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', slot: '' })}
        onConfirm={() => deleteMutation.mutate(deleteModal.id)}
        title="Delete Ad Placement"
        message={`Are you sure you want to delete the ad placement for "${deleteModal.slot.replace(/_/g, ' ')}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
