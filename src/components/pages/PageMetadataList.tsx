'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, ExternalLink, Search, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import UpdatePageMetadataDrawer from './UpdatePageMetadataDrawer';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

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
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: 0, name: '' });
  
  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all page metadata
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pageMetadata'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/seo/type/page`);
      const result = await response.json();
      return result.data || [];
    },
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredPages = pages.filter((page: PageMetadata) => 
    page.pageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.pageSlug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (page.metaTitle && page.metaTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const totalItems = filteredPages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPages = filteredPages.slice(startIndex, startIndex + itemsPerPage);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
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
      setDeleteModal({ isOpen: false, id: 0, name: '' });
    },
    onError: (error: any) => {
      toast.error(`❌ ${error.message || 'Failed to delete page metadata'}`);
    },
  });

  const handleEdit = (page: PageMetadata) => {
    setSelectedPage(page);
    setUpdateDrawerOpen(true);
  };

  const handleDelete = (id: number, pageName: string) => {
    setDeleteModal({ isOpen: true, id, name: pageName });
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-linear-to-r from-slate-900/50 via-slate-900/40 to-slate-800/50 border border-slate-700/60 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none shrink-0" />
            <input
              type="text"
              placeholder="Search by page name, slug or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-[nunito] w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-linear-to-br from-slate-900/60 via-slate-900/40 to-slate-800/60 border border-slate-700/60 rounded-lg sm:rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="text-center">
              <Loader className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
              <p className="text-slate-400 font-[nunito] text-sm">Loading metadata...</p>
            </div>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center py-12 sm:py-16 font-[nunito]">
            <p className="text-slate-400 text-base">No page metadata found</p>
            <p className="text-slate-500 text-xs mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-slate-700/60 bg-linear-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm">
                  <th className="px-4 md:px-6 py-3 sm:py-4 text-left text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                    Page Name
                  </th>
                  <th className="hidden md:table-cell px-4 md:px-6 py-3 sm:py-4 text-left text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                    Slug
                  </th>
                  <th className="hidden lg:table-cell px-4 md:px-6 py-3 sm:py-4 text-left text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                    Meta Title
                  </th>
                  <th className="px-4 md:px-6 py-3 sm:py-4 text-center text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider font-[nunito]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPages.map((page: PageMetadata, index: number) => (
                  <tr
                    key={page.id}
                    className={`border-b border-slate-700/40 hover:bg-slate-800/40 transition-all duration-200 group ${
                      index === paginatedPages.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-xs sm:text-sm font-[nunito]">
                          {page.pageName}
                        </span>
                        <a
                          href={`https://game-web-app1.vercel.app${page.pageSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 md:px-6 py-3 sm:py-4">
                      <span className="text-slate-400 text-xs sm:text-sm font-[nunito]">
                        {page.pageSlug}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-4 md:px-6 py-3 sm:py-4">
                      <p className="text-slate-300 text-xs sm:text-sm truncate max-w-xs font-[nunito]">
                        {page.metaTitle || '-'}
                      </p>
                    </td>
                    <td className="px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(page)}
                          className="p-1.5 sm:p-2 hover:bg-yellow-500/20 rounded-lg transition-all duration-200 hover:scale-110 group/btn shrink-0"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 group-hover/btn:text-yellow-300" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id, page.pageName)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110 group/btn shrink-0 disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteMutation.isPending ? (
                            <Loader className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 group-hover/btn:text-red-300" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && filteredPages.length > 0 && (
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-linear-to-r from-slate-800/40 to-slate-800/20 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-slate-400">
            <div className="font-[nunito] order-2 sm:order-1">
              Showing <span className="text-purple-400 font-bold">{Math.min(startIndex + 1, totalItems)}</span> to <span className="text-purple-400 font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{' '}
              <span className="text-purple-400 font-bold">{totalItems}</span> pages
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              
              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold transition-all font-[nunito] ${
                        currentPage === pageNum 
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 sm:p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}
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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: 0, name: '' })}
        onConfirm={() => deleteMutation.mutate(deleteModal.id)}
        title="Delete Page SEO"
        message={`Are you sure you want to delete SEO metadata for "${deleteModal.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
