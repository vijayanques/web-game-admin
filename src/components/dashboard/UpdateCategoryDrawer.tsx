'use client';

import { useState, useEffect } from 'react';
import { X, Gamepad2, Zap, Shield, Wand2, Sword, Brain, Music, Trophy, Flame, Wind, Droplets, Sparkles, Target, Rocket, Crown, Dices } from 'lucide-react';
import { useUpdateCategory } from '@/lib/hooks/useCategories';
import { Category } from '@/lib/api/categories';
import SeoMetadataForm from '@/components/SeoMetadataForm';

interface UpdateCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
}

const AVAILABLE_ICONS = [
  { name: 'Gamepad', icon: Gamepad2 },
  { name: 'Zap', icon: Zap },
  { name: 'Shield', icon: Shield },
  { name: 'Wand', icon: Wand2 },
  { name: 'Sword', icon: Sword },
  { name: 'Brain', icon: Brain },
  { name: 'Music', icon: Music },
  { name: 'Trophy', icon: Trophy },
  { name: 'Flame', icon: Flame },
  { name: 'Wind', icon: Wind },
  { name: 'Droplets', icon: Droplets },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Target', icon: Target },
  { name: 'Rocket', icon: Rocket },
  { name: 'Crown', icon: Crown },
  { name: 'Dices', icon: Dices },
];

export default function UpdateCategoryDrawer({ isOpen, onClose, category }: UpdateCategoryDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: null as File | null,
    imagePreview: '',
    icon: '',
    isActive: true,
  });
  const [seoSaved, setSeoSaved] = useState(false);

  const updateMutation = useUpdateCategory();
  const isSubmitting = updateMutation.isPending;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug || '',
        description: category.description,
        image: null,
        imagePreview: category.image || '',
        icon: category.icon || '',
        isActive: category.isActive,
      });
    }
  }, [category, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // Auto-generate slug from name
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      setFormData(prev => ({
        ...prev,
        name: value,
        slug: generatedSlug,
      }));
    } else if (name === 'isActive') {
      setFormData(prev => ({
        ...prev,
        [name]: value === 'true',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isActive', String(formData.isActive));
      if (formData.icon) {
        formDataToSend.append('icon', formData.icon);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await updateMutation.mutateAsync({
        id: category.id,
        payload: formDataToSend as any,
      });

      onClose();
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const isFormValid = formData.name?.trim() && formData.description?.trim();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-slate-900 border-l border-slate-700 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-linear-to-r from-purple-600/10 to-pink-600/10">
          <h2 className="text-xl font-bold text-white">Update Category</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Action, RPG, Puzzle"
                className="cursor-pointer w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Slug (Auto-generated)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                readOnly
                placeholder="auto-generated from name"
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-400 placeholder-slate-600 text-sm focus:outline-none cursor-not-allowed opacity-75"
              />
              <p className="text-xs text-slate-500 mt-1">Automatically generated from category name</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe this category..."
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                required
              />
              <p className="text-xs text-slate-500 mt-1">{formData.description.length}/500 characters</p>
            </div>

            {/* Icon Selector */}
            <div>
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Category Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_ICONS.map(({ name, icon: IconComponent }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon: name }))}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all flex items-center justify-center ${formData.icon === name
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                      }`}
                    title={name}
                  >
                    <IconComponent className="cursor-pointer w-5 h-5 text-white" />
                  </button>
                ))}
              </div>
              {formData.icon && (
                <p className="cursor-pointer text-xs text-slate-400 mt-2">Selected: {formData.icon}</p>
              )}
            </div>


            {/* Error Message */}
            {updateMutation.isError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">
                  {updateMutation.error instanceof Error ? updateMutation.error.message : 'Failed to update category'}
                </p>
              </div>
            )}

            {/* Success Message */}
            {updateMutation.isSuccess && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-400">Category updated successfully!</p>
              </div>
            )}

            {/* SEO Metadata Section */}
            {category?.id && (
              <div className="border-t border-slate-700 pt-4 mt-4">
                <SeoMetadataForm
                  entityType="category"
                  entityId={category.id}
                  entityTitle={formData.name || category.name}
                  entitySlug={formData.slug || category.slug}
                  onSuccess={() => setSeoSaved(true)}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="cursor-pointer flex-1 px-4 py-2.5 bg-slate-800 text-white font-semibold text-sm rounded-lg border border-slate-600 hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`flex-1 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 ${isFormValid && !isSubmitting
                  ? 'hover:shadow-lg hover:shadow-purple-600/50 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
                  }`}
              >
                {isSubmitting ? (
                  <span className="cursor-pointer flex items-center justify-center gap-2">
                    <div className="cursor-pointer w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Update Category'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
