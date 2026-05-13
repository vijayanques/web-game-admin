'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import SeoMetadataForm from '@/components/SeoMetadataForm';

interface CreatePageMetadataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'https://game-backend-production-3988.up.railway.app';
  // Remove trailing slashes and ensure /api is only added once
  const clean = url.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
})();


// Predefined pages
const PREDEFINED_PAGES = [
  { name: 'Home / Landing Page', slug: '/' },
  { name: 'Privacy Policy', slug: '/privacy-policy' },
  { name: 'Terms of Service', slug: '/terms-of-service' },
  { name: 'About Us', slug: '/about' },
  { name: 'Contact Us', slug: '/contact' },
  { name: 'Login', slug: '/login' },
  { name: 'Sign Up', slug: '/signup' },
  { name: 'Profile', slug: '/profile' },
  { name: 'Reset Password', slug: '/reset-password' },
];

export default function CreatePageMetadataDrawer({ isOpen, onClose }: CreatePageMetadataDrawerProps) {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState('');
  const [customName, setCustomName] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [createdPageId, setCreatedPageId] = useState<number | null>(null);

  // Create page mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const page = PREDEFINED_PAGES.find(p => p.slug === selectedPage);
      const pageName = selectedPage === 'custom' ? customName : page?.name || '';
      const pageSlug = selectedPage === 'custom' ? customSlug : selectedPage;

      if (!pageName || !pageSlug) {
        throw new Error('Please fill in all fields');
      }

      // Create a unique ID for the page (using timestamp + random)
      const pageId = Date.now();

      const response = await fetch(`${API_BASE_URL}/seo/page/${pageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageName,
          pageSlug: `/${pageSlug.replace(/^\/+/, '')}`, // Ensure slug starts with /
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          canonicalUrl: `https://game-web-app1.vercel.app${pageSlug}`,
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          twitterTitle: '',
          twitterDescription: '',
          twitterImage: '',
          robots: 'index, follow',
        }),
      });

      if (!response.ok) throw new Error('Failed to create page');
      const result = await response.json();
      return { ...result, id: pageId };
    },
    onSuccess: (data) => {
      toast.success('Page created! Now add SEO metadata');
      queryClient.invalidateQueries({ queryKey: ['pageMetadata'] });
      setCreatedPageId(data.id);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create page');
    },
  });

  const handleCreate = () => {
    createMutation.mutate();
  };

  const handleClose = () => {
    setSelectedPage('');
    setCustomName('');
    setCustomSlug('');
    setCreatedPageId(null);
    onClose();
  };

  if (!isOpen) return null;

  const page = PREDEFINED_PAGES.find(p => p.slug === selectedPage);
  const pageName = selectedPage === 'custom' ? customName : page?.name || '';
  const pageSlug = selectedPage === 'custom' ? customSlug : selectedPage;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={handleClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Add Page SEO</h2>
          <button onClick={handleClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!createdPageId ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Select Page *
                </label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">Choose a page...</option>
                  {PREDEFINED_PAGES.map((page) => (
                    <option key={page.slug} value={page.slug}>
                      {page.name}
                    </option>
                  ))}
                  <option value="custom">Custom Page</option>
                </select>
              </div>

              {selectedPage === 'custom' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Page Name *
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g., FAQ Page"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Page Slug *
                    </label>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="/faq"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                    <p className="text-xs text-slate-500 mt-1">Must start with /</p>
                  </div>
                </>
              )}

              {selectedPage && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Preview URL:</p>
                  <p className="text-sm text-purple-400 font-mono">
                    https://game-web-app1.vercel.app{pageSlug}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="border-t border-slate-700 pt-4">
              <SeoMetadataForm
                entityType="page"
                entityId={createdPageId}
                entityTitle={pageName}
                entitySlug={pageSlug}
                onSuccess={handleClose}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold"
          >
            {createdPageId ? 'Close' : 'Cancel'}
          </button>
          {!createdPageId && (
            <button
              onClick={handleCreate}
              disabled={!selectedPage || createMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create & Add SEO'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
