'use client';

import { useState } from 'react';
import { Upload, Gamepad2, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface CreateGameProps {
  onBack?: () => void;
}

interface Category {
  id: number;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.118:8000';

const createGame = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/games`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to create game');
  }
  
  return data.data;
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/api/categories/admin/all`);
  const data = await response.json();
  if (!data.success) {
    throw new Error('Failed to fetch categories');
  }
  return data.data;
};

export default function CreateGame({ onBack }: CreateGameProps) {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categoryId: '',
    gameUrl: '',
    description: '',
    genre: '',
    rating: '0',
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Create game mutation
  const createGameMutation = useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      toast.success('Game created successfully!');
      queryClient.invalidateQueries({ queryKey: ['games'] });
      // Reset form
      setFormData({
        title: '',
        slug: '',
        categoryId: '',
        gameUrl: '',
        description: '',
        genre: '',
        rating: '0',
      });
      setThumbnail(null);
      setThumbnailPreview('');
      if (onBack) onBack();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create game');
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setFormData((prev) => ({
      ...prev,
      title,
      slug,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!thumbnail) {
      toast.error('Please upload a thumbnail image');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('categoryId', formData.categoryId);
    submitData.append('gameUrl', formData.gameUrl);
    submitData.append('description', formData.description);
    submitData.append('genre', formData.genre);
    submitData.append('rating', formData.rating);
    submitData.append('thumbnail', thumbnail);

    createGameMutation.mutate(submitData);
  };

  const isFormValid = formData.title && formData.categoryId && formData.gameUrl && formData.description && formData.genre && thumbnail;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Create New Game
            </h1>
            <p className="text-sm sm:text-base text-slate-400">Add a new game to your platform</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Form Section 1: Basic Info */}
          <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Basic Information</h2>
            </div>

            {/* Game Name */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Game Name *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter an engaging game name"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 hover:border-slate-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Make it catchy and memorable</p>
            </div>

            {/* Slug (Auto-generated) */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Slug (Auto-generated)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                readOnly
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/30 border border-slate-600 rounded-lg text-slate-400 text-sm sm:text-base focus:outline-none cursor-not-allowed"
                placeholder="auto-generated-from-title"
              />
              <p className="text-xs text-slate-500 mt-1">URL-friendly identifier for your game</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 hover:border-slate-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">Choose the most relevant category</p>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Genre *
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                placeholder="e.g., Action, Adventure, Puzzle"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 hover:border-slate-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Game genre or type</p>
            </div>
          </div>

          {/* Form Section 2: Media */}
          <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Media & Assets</h2>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Thumbnail *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-input"
                />
                <label
                  htmlFor="thumbnail-input"
                  className="flex items-center justify-center w-full px-3 sm:px-4 py-6 sm:py-8 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-all duration-200 group"
                >
                  {thumbnailPreview ? (
                    <div className="relative w-full">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-32 sm:h-48 object-cover rounded-lg shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-white text-xs sm:text-sm font-bold">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
                      <p className="text-slate-300 font-semibold text-xs sm:text-base">
                        Click to upload thumbnail
                      </p>
                      <p className="text-slate-500 text-xs">PNG, JPG up to 10MB • Recommended: 1280x720px</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Form Section 3: Details */}
          <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Game Details</h2>
            </div>

            {/* Game URL */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Game URL *
              </label>
              <input
                type="url"
                name="gameUrl"
                value={formData.gameUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/game"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 hover:border-slate-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Where players can access your game</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2 uppercase tracking-wider">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your game, features, and what makes it unique..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 resize-none hover:border-slate-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">{formData.description.length}/500 characters</p>
            </div>
          </div>

          {/* Form Validation Alert */}
          {!isFormValid && (
            <div className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
              <p className="text-xs sm:text-sm text-yellow-400">Please fill in all required fields</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={!isFormValid || createGameMutation.isPending}
              className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-300 transform ${
                isFormValid && !createGameMutation.isPending
                  ? 'hover:shadow-lg hover:shadow-purple-600/50 hover:scale-105 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {createGameMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Game'
              )}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-slate-800 text-white font-bold text-sm sm:text-base rounded-lg border border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-all duration-200"
            >
              Cancel
            </button>
          </div>

          {/* Form Info */}
          <div className="p-3 sm:p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400">
              💡 <span className="font-semibold">Tip:</span> Fill in all fields carefully. Your game will be reviewed before going live.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
