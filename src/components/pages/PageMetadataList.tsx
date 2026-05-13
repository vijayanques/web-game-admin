'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import UpdatePageMetadataDrawer from './UpdatePageMetadataDrawer';

interface PageMetadata {
  id: number;
  entityType: string;
  entityId: number;
  pageName: string;
  pageSlug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.118:8000';

export default function PageMetadataList() {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<PageMetadata | null>(null);
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);

  // Fetch all page metadata
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pageMetadata'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/seo/type/page`);
      const result = await response.json();
      return result.data || [];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Deleting page metadata with ID:', id);
      const response = await fetch(`${API_BASE_URL}/api/seo/page/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to delete');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('✅ Page metadata deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['pageMetadata'] });
    },
    onError: (error: any) => {
      toast.error(`❌ ${error.message || 'Failed to delete page metadata'}`);
      console.error('Delete error:', error);
    },
  });

  const handleEdit = (page: PageMetadata) => {
    console.log('✏️ Editing page:', page);
    setSelectedPage(page);
    setUpdateDrawerOpen(true);
  };

  const handleDelete = (id: number, pageName: string) => {
    if (confirm(`Are you sure you want to delete SEO metadata for "${pageName}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (pages.length === 0) {
    return (
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-8 text-center">
        <p className="text-slate-400">No page metadata found. Add your first page!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {pages.map((page: PageMetadata) => (
          <div
            key={page.id}
            className="bg-slate-900 rounded-lg border border-slate-800 p-6 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{page.pageName}</h3>
                  <a
                    href={`https://game-web-app1.vercel.app${page.pageSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-sm text-slate-400 mb-1">
                  <span className="font-semibold">Slug:</span> {page.pageSlug}
                </p>
                <p className="text-sm text-slate-400 mb-1">
                  <span className="font-semibold">Meta Title:</span> {page.metaTitle || 'Not set'}
                </p>
                <p className="text-sm text-slate-400">
                  <span className="font-semibold">Meta Description:</span>{' '}
                  {page.metaDescription ? `${page.metaDescription.substring(0, 100)}...` : 'Not set'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(page)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  title="Edit metadata"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(page.id, page.pageName)}
                  disabled={deleteMutation.isPending}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete metadata"
                >
                  {deleteMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPage && (
        <UpdatePageMetadataDrawer
          isOpen={updateDrawerOpen}
          onClose={() => {
            setUpdateDrawerOpen(false);
            setSelectedPage(null);
          }}
          page={selectedPage}
        />
      )}
    </>
  );
}
