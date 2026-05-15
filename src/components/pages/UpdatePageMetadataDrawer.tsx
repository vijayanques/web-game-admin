'use client';

import { X } from 'lucide-react';
import SeoMetadataForm from '@/components/SeoMetadataForm';

interface PageMetadata {
  id: number;
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

interface UpdatePageMetadataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  page: PageMetadata;
}

export default function UpdatePageMetadataDrawer({ isOpen, onClose, page }: UpdatePageMetadataDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Update Page SEO</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="cursor-pointer w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">{page.pageName}</h3>
            <p className="text-sm text-slate-400">{page.pageSlug}</p>
          </div>

          <SeoMetadataForm
            entityType="page"
            entityId={page.id}
            entityTitle={page.pageName}
            entitySlug={page.pageSlug}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}
