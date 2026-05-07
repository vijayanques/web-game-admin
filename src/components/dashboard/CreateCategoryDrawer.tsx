'use client';

import { useState } from 'react';
import { X, Gamepad2, Sword, Shield, Car, Rocket, Target, Crosshair, Puzzle, Dices, Flame, Zap, Crown, Trophy, Star, Sparkles, Heart, Ghost, Skull, Bomb, Wand2, Users, Brain, Lightbulb, Smile, Wind, Waves, Mountain, Flower, Gem, Compass, Map, Castle, Tent, Cloud, Sun, Moon, Droplet, Leaf, Trees, Bird, Fish, Anchor, Activity, Cpu, Database, Server, Wifi, Radio, Tv, Monitor, Smartphone, Camera, Video, Film, Music, Palette, Book, Tag } from 'lucide-react';
import { useCreateCategory } from '@/lib/hooks/useCategories';

// Available game-related icons for selection
const availableIcons = [
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Sword', component: Sword },
  { name: 'Shield', component: Shield },
  { name: 'Car', component: Car },
  { name: 'Rocket', component: Rocket },
  { name: 'Target', component: Target },
  { name: 'Crosshair', component: Crosshair },
  { name: 'Puzzle', component: Puzzle },
  { name: 'Dices', component: Dices },
  { name: 'Flame', component: Flame },
  { name: 'Zap', component: Zap },
  { name: 'Crown', component: Crown },
  { name: 'Trophy', component: Trophy },
  { name: 'Star', component: Star },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Heart', component: Heart },
  { name: 'Ghost', component: Ghost },
  { name: 'Skull', component: Skull },
  { name: 'Bomb', component: Bomb },
  { name: 'Wand2', component: Wand2 },
  { name: 'Users', component: Users },
  { name: 'Brain', component: Brain },
  { name: 'Lightbulb', component: Lightbulb },
  { name: 'Smile', component: Smile },
  { name: 'Wind', component: Wind },
  { name: 'Waves', component: Waves },
  { name: 'Mountain', component: Mountain },
  { name: 'Flower', component: Flower },
  { name: 'Gem', component: Gem },
  { name: 'Compass', component: Compass },
  { name: 'Map', component: Map },
  { name: 'Castle', component: Castle },
  { name: 'Tent', component: Tent },
  { name: 'Cloud', component: Cloud },
  { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon },
  { name: 'Droplet', component: Droplet },
  { name: 'Leaf', component: Leaf },
  { name: 'Trees', component: Trees },
  { name: 'Bird', component: Bird },
  { name: 'Fish', component: Fish },
  { name: 'Anchor', component: Anchor },
  { name: 'Activity', component: Activity },
  { name: 'Cpu', component: Cpu },
  { name: 'Database', component: Database },
  { name: 'Server', component: Server },
  { name: 'Wifi', component: Wifi },
  { name: 'Radio', component: Radio },
  { name: 'Tv', component: Tv },
  { name: 'Monitor', component: Monitor },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Camera', component: Camera },
  { name: 'Video', component: Video },
  { name: 'Film', component: Film },
  { name: 'Music', component: Music },
  { name: 'Palette', component: Palette },
  { name: 'Book', component: Book },
  { name: 'Tag', component: Tag },
];

interface CreateCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCategoryDrawer({ isOpen, onClose }: CreateCategoryDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Gamepad2' as string,
  });

  const createMutation = useCreateCategory();
  const isSubmitting = createMutation.isPending;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send as JSON instead of FormData
      const payload = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
      };

      console.log('Submitting category with payload:', payload);
      console.log('Selected icon:', formData.icon);

      await createMutation.mutateAsync(payload as any);

      // Reset form and close drawer
      setFormData({ name: '', slug: '', description: '', icon: 'Gamepad2' });
      onClose();
    } catch (error) {
      console.error('Failed to create category:', error);
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
        className={`fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-700 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 bg-linear-to-r from-purple-600/10 to-pink-600/10 sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold text-white font-[nunito]">Create Category</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-80px)] p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider font-[nunito]">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Action, RPG, Puzzle"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              required
            />
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Enter a unique category name</p>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider font-[nunito]">
              Slug (Auto-generated)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              readOnly
              placeholder="auto-generated from name"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-400 placeholder-slate-600 text-xs sm:text-sm focus:outline-none cursor-not-allowed opacity-75"
            />
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Automatically generated from category name</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider font-[nunito]">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this category..."
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              required
            />
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">{formData.description.length}/500 characters</p>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 uppercase tracking-wider font-[nunito]">
              Category Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-56 sm:max-h-64 overflow-y-auto p-2 bg-slate-800/30 rounded-lg border border-slate-700">
              {availableIcons.map(({ name, component: IconComponent }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      icon: name,
                    }));
                  }}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    formData.icon === name
                      ? 'border-purple-500 bg-purple-500/30 shadow-lg shadow-purple-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
                  }`}
                  title={name}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto" />
                </button>
              ))}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-2">Selected: <span className="text-purple-400 font-semibold">{formData.icon}</span></p>
          </div>

          {/* Error Message */}
          {createMutation.isError && (
            <div className="p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs sm:text-sm text-red-400 font-[nunito]">
                {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to create category'}
              </p>
            </div>
          )}

          {/* Success Message */}
          {createMutation.isSuccess && (
            <div className="p-2.5 sm:p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-xs sm:text-sm text-green-400 font-[nunito]">Category created successfully!</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t border-slate-700 bg-slate-800/50 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-lg border border-slate-600 hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 font-[nunito]"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`cursor-pointer flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all duration-200 font-[nunito] ${
              isFormValid && !isSubmitting
                ? 'hover:shadow-lg hover:shadow-purple-600/50 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Creating...</span>
                <span className="sm:hidden">...</span>
              </span>
            ) : (
              'Create Category'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
