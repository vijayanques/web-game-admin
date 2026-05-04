'use client';

import { X, Upload } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface CreateGameDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: number;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.118:8000';

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/api/categories/admin/all`);
  const data = await response.json();
  if (!data.success) {
    throw new Error('Failed to fetch categories');
  }
  return data.data;
};

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

export default function CreateGameDrawer({ isOpen, onClose }: CreateGameDrawerProps) {
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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
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
      setThumbnailFile(null);
      setThumbnailPreview('');
      onClose();
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setFormData({ ...formData, title, slug });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!thumbnailFile) {
      toast.error('Please upload a thumbnail image');
      return;
    }

    if (!formData.title || !formData.categoryId || !formData.gameUrl || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Clean and validate game URL format
    const cleanedUrl = formData.gameUrl.trim();
    const isIframe = cleanedUrl.startsWith('<iframe');
    const isDirectUrl = cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://');
    
    if (!isIframe && !isDirectUrl) {
      toast.error('Game URL must be a direct URL (http:// or https://) or iframe HTML');
      return;
    }
    
    // If it's an iframe, validate and extract src
    if (isIframe) {
      // Check if iframe is complete (has closing tag)
      if (!cleanedUrl.includes('</iframe>') && !cleanedUrl.endsWith('/>')) {
        toast.error('Incomplete iframe HTML - please paste the complete iframe code');
        return;
      }
      
      const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/i;
      const match = cleanedUrl.match(iframeRegex);
      if (!match || !match[1]) {
        toast.error('Invalid iframe HTML - missing src attribute');
        return;
      }
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('categoryId', formData.categoryId);
    submitData.append('gameUrl', cleanedUrl);
    submitData.append('description', formData.description);
    submitData.append('genre', formData.genre || 'General'); // Default genre if not provided
    submitData.append('rating', formData.rating);
    submitData.append('thumbnail', thumbnailFile);

    createGameMutation.mutate(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Create Game</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Game Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              placeholder="Enter game title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Slug (Auto-generated)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              readOnly
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-400 placeholder-slate-500 focus:outline-none cursor-not-allowed"
              placeholder="auto-generated-from-title"
            />
            <p className="text-xs text-slate-500 mt-1">URL-friendly identifier</p>
          </div>

          <div>
            <label className=" block text-sm font-semibold text-slate-300 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className=" cursor-pointer w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Genre *
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              placeholder="e.g., Action, Adventure, Puzzle"
              required
            />
          </div> */}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Game URL *
            </label>
            <textarea
              name="gameUrl"
              value={formData.gameUrl}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none font-mono text-xs"
              placeholder="Direct URL: https://example.com/game&#10;OR&#10;Iframe: <iframe src='https://example.com/game'></iframe>"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Accepts direct URL or full iframe HTML code
            </p>
            {formData.gameUrl && formData.gameUrl.includes('syncframe') && (
              <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                ⚠️ Warning: This looks like a tracking iframe, not a game URL
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Thumbnail Image *
            </label>
            
            {/* File Upload Button */}
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-700/50 transition-all">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-300 font-medium">
                  {thumbnailFile ? thumbnailFile.name : 'Click to upload image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>

              {/* Image Preview */}
              {thumbnailPreview && (
                <div className="relative w-full h-40 bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview('');
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white cursor-pointer" />
                  </button>
                </div>
              )}

            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
              placeholder="Enter game description"
              rows={3}
              required
            />
          </div>
{/* 
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Rating (0-10)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              placeholder="0.0"
            />
          </div> */}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={onClose}
            className=" cursor-pointer flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={createGameMutation.isPending}
            className={` cursor-pointer flex-1 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold transition-all duration-200 ${
              createGameMutation.isPending
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-lg hover:shadow-purple-600/30'
            }`}
          >
            {createGameMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className=" cursor-pointer w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              'Create'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
