'use client';

import { AlertCircle } from 'lucide-react';
import { useDeleteCategory } from '@/lib/hooks/useCategories';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  categoryName: string;
  categoryId?: number;
  isLoading?: boolean;
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  categoryName,
  categoryId,
  isLoading: externalIsLoading,
}: DeleteCategoryModalProps) {
  const deleteMutation = useDeleteCategory();
  const isLoading = deleteMutation.isPending || externalIsLoading;

  const handleConfirmDelete = async () => {
    if (!categoryId) return;

    try {
      await deleteMutation.mutateAsync(categoryId);
      onClose();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Delete Category</h2>
              <p className="text-sm text-slate-400 mt-1">This action cannot be undone.</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-slate-300">
              Are you sure you want to delete <span className="font-semibold text-white">"{categoryName}"</span>?
            </p>
            <p className="text-sm text-slate-400">
              All games associated with this category will be affected.
            </p>

            {/* Error Message */}
            {deleteMutation.isError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">
                  {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Failed to delete category'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700 flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 cursor-pointer px-4 py-2.5 bg-slate-800 text-white font-semibold text-sm rounded-lg border border-slate-600 hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className=" cursor-pointer flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className=" w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
