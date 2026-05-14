'use client';

import { X, Loader2, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Game, gameAPI } from '@/lib/api/games';
import { categoryAPI } from '@/lib/api/categories';
import toast from 'react-hot-toast';
import SeoMetadataForm from '@/components/SeoMetadataForm';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';

interface UpdateGameDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.118:8000';

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function UpdateGameDrawer({ isOpen, onClose, game }: UpdateGameDrawerProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categoryId: 0,
    gameUrl: '',
    description: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [twitterImageFile, setTwitterImageFile] = useState<File | null>(null);
  const [ogImageUploading, setOgImageUploading] = useState(false);
  const [twitterImageUploading, setTwitterImageUploading] = useState(false);
  const [ogImagePreview, setOgImagePreview] = useState<string>('');
  const [twitterImagePreview, setTwitterImagePreview] = useState<string>('');

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryAPI.getAllCategories,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!game?.id) throw new Error('Game ID is required');
      const response = await fetch(`${API_BASE_URL}/api/games/${game.id}`, {
        method: 'PUT',
        body: data,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => {
      toast.success('Game updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['games'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update game');
    },
  });

  // Initialize form
  useEffect(() => {
    if (game) {
      let gameUrl = game.gameUrl || '';

      if (
        gameUrl.startsWith('<iframe') &&
        !gameUrl.includes('</iframe>') &&
        !gameUrl.endsWith('/>')
      ) {
        gameUrl += '</iframe>';
      }

      setFormData({
        title: game.title || '',
        slug: generateSlug(game.title || ''),
        categoryId: game.categoryId || 0,
        gameUrl,
        description: game.description || '',
      });

      setThumbnailPreview(game.thumbnail || '');
      setVideoPreview(game.videoUrl || '');
      setErrors({});
    }
  }, [game]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
    if (errors.title) setErrors({ ...errors, title: '' });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'categoryId' ? Number(value) : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
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

  // Handle OG image upload
  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOgImageFile(file);
    setOgImageUploading(true);

    try {
      const result = await uploadToCloudinary(file, `theplayfree/seo/game`);
      if (result.success && result.url) {
        setOgImagePreview(result.url);
        toast.success('OG image uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload OG image');
        setOgImageFile(null);
      }
    } catch (error) {
      toast.error('Upload failed');
      setOgImageFile(null);
    } finally {
      setOgImageUploading(false);
    }
  };

  // Handle Twitter image upload
  const handleTwitterImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTwitterImageFile(file);
    setTwitterImageUploading(true);

    try {
      const result = await uploadToCloudinary(file, `theplayfree/seo/game`);
      if (result.success && result.url) {
        setTwitterImagePreview(result.url);
        toast.success('Twitter image uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload Twitter image');
        setTwitterImageFile(null);
      }
    } catch (error) {
      toast.error('Upload failed');
      setTwitterImageFile(null);
    } finally {
      setTwitterImageUploading(false);
    }
  };

  // Clear OG image
  const clearOgImage = () => {
    setOgImagePreview('');
    setOgImageFile(null);
  };

  // Clear Twitter image
  const clearTwitterImage = () => {
    setTwitterImagePreview('');
    setTwitterImageFile(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.gameUrl.trim()) {
      newErrors.gameUrl = 'Game URL is required';
    } else {
      const cleaned = formData.gameUrl.trim();
      const isIframe = cleaned.startsWith('<iframe');
      const isUrl = cleaned.startsWith('http://') || cleaned.startsWith('https://');

      if (!isIframe && !isUrl) {
        newErrors.gameUrl = 'Must be valid URL or iframe';
      }

      if (isIframe) {
        if (!cleaned.includes('</iframe>') && !cleaned.endsWith('/>')) {
          newErrors.gameUrl = 'Incomplete iframe';
        } else {
          const match = cleaned.match(/src=["']([^"']+)["']/);
          if (!match) newErrors.gameUrl = 'Invalid iframe src';
          else if (match[1].includes('syncframe')) {
            newErrors.gameUrl = 'Tracking iframe not allowed';
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('categoryId', formData.categoryId.toString());
    submitData.append('gameUrl', formData.gameUrl);
    submitData.append('description', formData.description);

    if (thumbnailFile) {
      submitData.append('thumbnail', thumbnailFile);
    }

    if (videoFile) {
      submitData.append('video', videoFile);
    }

    // Add SEO metadata with images if available
    if (ogImagePreview || twitterImagePreview) {
      const seoMetadata = {
        ogImage: ogImagePreview,
        twitterImage: twitterImagePreview,
      };
      submitData.append('seoMetadata', JSON.stringify(seoMetadata));
    }

    updateMutation.mutate(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Update Game</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Game Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${errors.title ? 'border-red-500' : 'border-slate-600'
                }`}
              placeholder="Enter game title"
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Slug (Auto-generated)
            </label>
            <input
              type="text"
              value={formData.slug}
              readOnly
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              disabled={categoriesLoading}
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${errors.categoryId ? 'border-red-500' : 'border-slate-600'
                }`}
            >
              <option value={0}>Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Game URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Game URL *
            </label>
            <textarea
              name="gameUrl"
              value={formData.gameUrl}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none font-mono text-xs ${errors.gameUrl ? 'border-red-500' : 'border-slate-600'
                }`}
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Thumbnail Image
            </label>
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

              {thumbnailPreview && (
                <div className="relative w-full h-40 bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  {thumbnailFile && (
                    <button
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview('');
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Preview Video (Optional)
            </label>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-700/50 transition-all">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-300 font-medium">
                  {videoFile ? videoFile.name : 'Click to upload video'}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>

              {videoPreview && (
                <div className="relative w-full h-40 bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
                  <video
                    src={videoPreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                  {videoFile && (
                    <button
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview('');
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-500">Plays on hover when users view the game card</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
            />
          </div>

          {/* Open Graph Image */}
          {/* <div className="border-t border-slate-700 pt-4 mt-4">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Open Graph Image (Social Media)
            </label>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-700/50 transition-all">
                {ogImageUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                    <span className="text-sm text-slate-300 font-medium">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-300 font-medium">
                      {ogImageFile ? ogImageFile.name : 'Click to upload OG image'}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOgImageUpload}
                  disabled={ogImageUploading}
                  className="hidden"
                />
              </label>

              {ogImagePreview && (
                <div className="relative w-full h-40 bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src={ogImagePreview}
                    alt="OG Image preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={clearOgImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500">Recommended: 1200x630px. Max 5MB.</p>
            </div>
          </div> */}

          {/* Twitter Card Image */}
          {/* <div className="border-t border-slate-700 pt-4 mt-4">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Twitter Card Image
            </label>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-700/50 transition-all">
                {twitterImageUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                    <span className="text-sm text-slate-300 font-medium">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-300 font-medium">
                      {twitterImageFile ? twitterImageFile.name : 'Click to upload Twitter image'}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTwitterImageUpload}
                  disabled={twitterImageUploading}
                  className="hidden"
                />
              </label>

              {twitterImagePreview && (
                <div className="relative w-full h-40 bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src={twitterImagePreview}
                    alt="Twitter Image preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={clearTwitterImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500">Recommended: 1200x630px. Max 5MB.</p>
            </div>
          </div> */}

          {/* SEO Metadata Section */}
          {game?.id && (
            <div className="border-t border-slate-700 pt-4 mt-4">
              <SeoMetadataForm
                entityType="game"
                entityId={game.id}
                entityTitle={formData.title || game.title}
                entitySlug={formData.slug || game.slug}
              />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={(e) => handleSubmit(e as any)}
            disabled={updateMutation.isPending}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Game'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
