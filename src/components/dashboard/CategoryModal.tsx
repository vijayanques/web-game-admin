'use client';

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  status: boolean;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  mode: 'create' | 'update';
}

export default function CategoryModal({ isOpen, onClose, category, mode }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    image: null as File | null,
    imagePreview: '',
    status: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'update' && category && isOpen) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        image: null,
        imagePreview: category.image || '',
        status: category.status,
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        image: null,
        imagePreview: '',
        status: true,
      });
    }
  }, [category, isOpen, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-');
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: slug,
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

  const handleStatusToggle = () => {
    setFormData(prev => ({
      ...prev,
      status: !prev.status,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      console.log(`Category ${mode}d:`, formData);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const isFormValid = formData.name?.trim() && formData.slug?.trim() && formData.description?.trim() && formData.icon?.trim();
  const title = mode === 'create' ? 'Create Category' : 'Update Category';
  const buttonText = mode === 'create' ? 'Create Category' : 'Update Category';

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
        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-linear-to-r from-purple-600/10 to-pink-600/10 sticky top-0">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
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
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Enter a unique category name</p>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="auto-generated from name"
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
              <p className="text-xs text-slate-500 mt-1">URL-friendly identifier</p>
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
              <p className="text-xs text-slate-500 mt-1">{formData.description.length}/200 characters</p>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Icon (Emoji or Unicode) *
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="e.g., 🎮, 🏃, 🧩"
                maxLength={2}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-center text-2xl"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Single emoji or icon</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Category Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-all group"
                >
                  {formData.imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-bold">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
                      <p className="text-slate-300 font-semibold text-sm">Click to upload image</p>
                      <p className="text-slate-500 text-xs">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Status Toggle */}
            <div>
              <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                Status
              </label>
              <button
                type="button"
                onClick={handleStatusToggle}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                  formData.status
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                    : 'bg-slate-800/50 border-slate-600 text-slate-400'
                }`}
              >
                <span className="font-semibold text-sm">{formData.status ? 'Active' : 'Inactive'}</span>
                <div className={`w-12 h-6 rounded-full transition-all ${
                  formData.status ? 'bg-purple-500' : 'bg-slate-600'
                } flex items-center ${formData.status ? 'justify-end' : 'justify-start'} p-1`}>
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-800 text-white font-semibold text-sm rounded-lg border border-slate-600 hover:bg-slate-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`flex-1 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 ${
                  isFormValid && !isSubmitting
                    ? 'hover:shadow-lg hover:shadow-purple-600/50 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </span>
                ) : (
                  buttonText
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
