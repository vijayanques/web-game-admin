'use client';

import { X, Upload } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import SeoMetadataForm from '@/components/SeoMetadataForm';

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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [createdGameId, setCreatedGameId] = useState<number | null>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Create game mutation
  const createGameMutation = useMutation({
    mutationFn: createGame,
    onSuccess: (data) => {
      toast.success('Game created successfully!');
      queryClient.invalidateQueries({ queryKey: ['games'] });
      setCreatedGameId(data.id);
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
      setVideoFile(null);
      setVideoPreview('');
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
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
      if (videoFile) {
      submitData.append('video', videoFile);
    }

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
      <div className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-700 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <h2 className="text-lg sm:text-xl font-bold text-white font-[nunito]">Create Game</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
          onScroll={(e) => setIsScrolled((e.target as HTMLDivElement).scrollTop > 0)}
        >
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              Game Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              placeholder="Enter game title"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              Slug (Auto-generated)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              readOnly
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-400 placeholder-slate-500 text-xs sm:text-sm focus:outline-none cursor-not-allowed"
              placeholder="auto-generated-from-title"
            />
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">URL-friendly identifier</p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="cursor-pointer w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              Game URL *
            </label>
            <textarea
              name="gameUrl"
              value={formData.gameUrl}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-[10px] sm:text-xs focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none font-mono"
              placeholder="Direct URL: https://example.com/game&#10;OR&#10;Iframe: <iframe src='https://example.com/game'></iframe>"
              required
            />
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
              Accepts direct URL or full iframe HTML code
            </p>
            {formData.gameUrl && formData.gameUrl.includes('syncframe') && (
              <p className="text-[10px] sm:text-xs text-amber-400 mt-1 flex items-center gap-1">
                ⚠️ Warning: This looks like a tracking iframe, not a game URL
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              Thumbnail Image *
            </label>
            
            {/* File Upload Button */}
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-700/50 transition-all">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium truncate">
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
                <div className="relative w-full h-32 sm:h-40 bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
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
                    className="absolute top-2 right-2 p-1 sm:p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white cursor-pointer" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              Preview Video (Optional)
            </label>
            
            {/* File Upload Button */}
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-700/50 transition-all">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                  {videoFile ? videoFile.name : 'Click to upload video'}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>

              {/* Video Preview */}
              {videoPreview && (
                <div className="relative w-full h-32 sm:h-40 bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
                  <video
                    src={videoPreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                  <button
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview('');
                    }}
                    className="absolute top-2 right-2 p-1 sm:p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white cursor-pointer" />
                  </button>
                </div>
              )}
              <p className="text-[10px] sm:text-xs text-slate-500">Plays on hover when users view the game card</p>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
              placeholder="Enter game description"
              rows={3}
              required
            />
          </div>

          {/* SEO Metadata Section */}
          <div className="border-t border-slate-700 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">SEO Metadata (Optional)</h3>
            {createdGameId ? (
              <SeoMetadataForm
                entityType="game"
                entityId={createdGameId}
                entityTitle={formData.title}
                entitySlug={formData.slug}
              />
            ) : (
              <p className="text-xs text-slate-400">Create the game first to add SEO metadata</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-2 sm:gap-3 p-4 sm:p-6 border-t border-slate-700 bg-slate-800/50 sticky bottom-0 ${isScrolled ? 'shadow-lg shadow-slate-900/50' : ''}`}>
          <button
            onClick={() => {
              setCreatedGameId(null);
              onClose();
            }}
            className="cursor-pointer flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200"
          >
            {createdGameId ? 'Close' : 'Cancel'}
          </button>
          {!createdGameId && (
            <button
              onClick={handleSubmit}
              disabled={createGameMutation.isPending}
              className={`cursor-pointer flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${
                createGameMutation.isPending
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg hover:shadow-purple-600/30'
              }`}
            >
              {createGameMutation.isPending ? (
                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <div className="cursor-pointer w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Creating...</span>
                  <span className="sm:hidden">...</span>
                </span>
              ) : (
                'Create'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
