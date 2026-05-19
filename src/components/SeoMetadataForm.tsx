'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';

interface SeoMetadataFormProps {
  entityType: 'game' | 'category' | 'page';
  entityId: number;
  entityTitle: string;
  entitySlug?: string; // Add slug prop
  onSuccess?: () => void;
}

interface SeoMetadata {
  pageName?: string;
  pageSlug?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
  favicon?: string;
}

const API_BASE_URL = (() => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'https://game-backend-production-3988.up.railway.app';
  // Ensure /api is at the end
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
})();

export default function SeoMetadataForm({
  entityType,
  entityId,
  entityTitle,
  entitySlug,
  onSuccess,
}: SeoMetadataFormProps) {
  const queryClient = useQueryClient();

  // Generate the page URL based on entity type and slug
  const pageUrl = entitySlug
    ? `https://game-web-app1.vercel.app/${entityType}/${entitySlug}`
    : '';
  const [formData, setFormData] = useState<SeoMetadata>({
    pageName: entityTitle,
    pageSlug: entitySlug ? `/${entitySlug.replace(/^\/+/, '')}` : '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    robots: 'index, follow',
    favicon: '',
  });

  // Image upload states
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [twitterImageFile, setTwitterImageFile] = useState<File | null>(null);
  const [ogImageUploading, setOgImageUploading] = useState(false);
  const [twitterImageUploading, setTwitterImageUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  // Fetch existing SEO metadata
  const { data: existingData, isLoading } = useQuery({
    queryKey: ['seoMetadata', entityType, entityId],
    queryFn: async () => {
      try {
        const url = `${API_BASE_URL}/seo/${entityType}/${entityId}`;
        console.log('🔍 Fetching existing SEO metadata from:', url);
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Existing metadata loaded:', data);
          return data;
        }
        console.warn('⚠️ No existing metadata found (404)');
        return null;
      } catch (error) {
        console.error('❌ Error fetching SEO metadata:', error);
        return null;
      }
    },
    staleTime: 0, // Always refetch to get latest data
    gcTime: 0, // Don't cache
  });

  // Update form when existing data loads
  useEffect(() => {
    if (existingData) {
      console.log('📝 Populating form with existing data:', existingData);
      setFormData({
        pageName: existingData.pageName || entityTitle,
        pageSlug: existingData.pageSlug || (entitySlug ? `/${entitySlug.replace(/^\/+/, '')}` : ''),
        metaTitle: existingData.metaTitle || '',
        metaDescription: existingData.metaDescription || '',
        metaKeywords: existingData.metaKeywords || '',
        canonicalUrl: existingData.canonicalUrl || pageUrl,
        ogTitle: existingData.ogTitle || '',
        ogDescription: existingData.ogDescription || '',
        ogImage: existingData.ogImage || '',
        twitterTitle: existingData.twitterTitle || '',
        twitterDescription: existingData.twitterDescription || '',
        twitterImage: existingData.twitterImage || '',
        robots: existingData.robots || 'index, follow',
        favicon: existingData.favicon || '',
      });
    } else if (pageUrl) {
      // If no existing data, set canonical URL to page URL
      console.log('📝 No existing data, using defaults');
      setFormData(prev => ({
        ...prev,
        pageName: entityTitle,
        pageSlug: entitySlug ? `/${entitySlug.replace(/^\/+/, '')}` : '',
        canonicalUrl: pageUrl,
      }));
    }
  }, [existingData, pageUrl, entitySlug, entityTitle]);

  // Save SEO metadata mutation
  const saveMutation = useMutation({
    mutationFn: async (data: SeoMetadata) => {
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://game-backend-production-3988.up.railway.app';
      // Ensure /api is at the end
      if (!apiUrl.endsWith('/api')) {
        apiUrl = `${apiUrl}/api`;
      }

      const url = `${apiUrl}/seo/${entityType}/${entityId}`;
      console.log('Saving SEO metadata to:', url);

      const pageSlugValue = entityType === 'page' && entitySlug
        ? `/${entitySlug.replace(/^\/+/, '')}`
        : data.pageSlug;

      const payload = {
        ...data,
        pageName: entityTitle,
        pageSlug: pageSlugValue,
      };

      console.log('Payload being sent:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `Failed to save SEO metadata (${response.status})`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success('SEO metadata saved successfully');
      // Invalidate the query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['seoMetadata', entityType, entityId] });
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to save SEO metadata';
      toast.error(errorMessage);
      console.error('Save error:', error);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle OG image upload
  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOgImageFile(file);
    setOgImageUploading(true);

    try {
      const result = await uploadToCloudinary(file, `theplayfree/seo/${entityType}`);
      if (result.success && result.url) {
        setFormData((prev) => {
          const updated = { ...prev };
          updated.ogImage = result.url || '';
          return updated;
        });
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
      const result = await uploadToCloudinary(file, `theplayfree/seo/${entityType}`);
      if (result.success && result.url) {
        setFormData((prev) => {
          const updated = { ...prev };
          updated.twitterImage = result.url || '';
          return updated;
        });
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
  
  // Handle Favicon upload
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFaviconFile(file);
    setFaviconUploading(true);

    try {
      const result = await uploadToCloudinary(file, `theplayfree/seo/favicon`);
      if (result.success && result.url) {
        setFormData((prev) => ({
          ...prev,
          favicon: result.url || '',
        }));
        toast.success('Favicon uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload favicon');
        setFaviconFile(null);
      }
    } catch (error) {
      toast.error('Upload failed');
      setFaviconFile(null);
    } finally {
      setFaviconUploading(false);
    }
  };

  // Clear OG image
  const clearOgImage = () => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated.ogImage = '';
      return updated;
    });
    setOgImageFile(null);
  };

  // Clear Twitter image
  const clearTwitterImage = () => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated.twitterImage = '';
      return updated;
    });
    setTwitterImageFile(null);
  };

  // Clear Favicon
  const clearFavicon = () => {
    setFormData((prev) => ({
      ...prev,
      favicon: '',
    }));
    setFaviconFile(null);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.metaTitle.trim()) {
      toast.error('Meta Title is required');
      return;
    }

    if (!formData.metaDescription.trim()) {
      toast.error('Meta Description is required');
      return;
    }

    if (!formData.canonicalUrl.trim()) {
      toast.error('Canonical URL is required');
      return;
    }

    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="text-slate-400">Loading SEO metadata...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          SEO Metadata for {entityTitle}
        </h3>

        {/* Meta Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Meta Title <span className="text-red-500">*</span>
            <span className="text-xs text-slate-400 ml-2">
              ({formData.metaTitle.length}/60)
            </span>
          </label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            maxLength={60}
            placeholder="Enter SEO title (60 chars max)"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Recommended: 50-60 characters
          </p>
        </div>

        {/* Meta Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Meta Description <span className="text-red-500">*</span>
            <span className="text-xs text-slate-400 ml-2">
              ({formData.metaDescription.length}/160)
            </span>
          </label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            maxLength={160}
            rows={3}
            placeholder="Enter SEO description (160 chars max)"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Recommended: 150-160 characters
          </p>
        </div>

        {/* Meta Keywords */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Meta Keywords
          </label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            placeholder="Comma-separated keywords (e.g., action, adventure, puzzle)"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Separate keywords with commas
          </p>
        </div>

        {/* Page URL (Read-only) */}
        {pageUrl && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Page URL
            </label>
            <div className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-400 font-mono text-sm">
              {pageUrl}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              This is the actual URL of the page
            </p>
          </div>
        )}

        {/* Canonical URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Canonical URL
          </label>
          <input
            type="url"
            name="canonicalUrl"
            value={formData.canonicalUrl}
            onChange={handleChange}
            placeholder={pageUrl || "https://game-web-app1.vercel.app/game/example"}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Should match the Page URL above (auto-populated)
          </p>
        </div>

        {/* Open Graph Section */}
        <div className="border-t border-slate-700 pt-4 mt-4">
          <h4 className="text-sm font-semibold text-slate-200 mb-3">
            Open Graph (Social Media)
          </h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              OG Title
            </label>
            <input
              type="text"
              name="ogTitle"
              value={formData.ogTitle}
              onChange={handleChange}
              placeholder="Title for social media sharing"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              OG Description
            </label>
            <textarea
              name="ogDescription"
              value={formData.ogDescription}
              onChange={handleChange}
              rows={2}
              placeholder="Description for social media sharing"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              OG Image
            </label>
            <div className="space-y-3">
              {/* Upload Button */}
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-600 rounded text-slate-300 cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-all">
                {ogImageUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {ogImageFile ? ogImageFile.name : 'Click to upload image'}
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

              {/* URL Input */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Or paste URL
                </label>
                <input
                  type="url"
                  name="ogImage"
                  value={formData.ogImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              {/* Image Preview */}
              {formData.ogImage && (
                <div className="relative w-full bg-slate-800 rounded border border-slate-600 overflow-hidden">
                  <img
                    src={formData.ogImage}
                    alt="OG Image Preview"
                    className="w-full h-auto max-h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={clearOgImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-500">
                Recommended: 1200x630px. Max 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Twitter Section */}
        <div className="border-t border-slate-700 pt-4 mt-4">
          <h4 className="text-sm font-semibold text-slate-200 mb-3">
            Twitter Card
          </h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Twitter Title
            </label>
            <input
              type="text"
              name="twitterTitle"
              value={formData.twitterTitle}
              onChange={handleChange}
              placeholder="Title for Twitter sharing"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Twitter Description
            </label>
            <textarea
              name="twitterDescription"
              value={formData.twitterDescription}
              onChange={handleChange}
              rows={2}
              placeholder="Description for Twitter sharing"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Twitter Image
            </label>
            <div className="space-y-3">
              {/* Upload Button */}
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-600 rounded text-slate-300 cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-all">
                {twitterImageUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {twitterImageFile ? twitterImageFile.name : 'Click to upload image'}
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

              {/* URL Input */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Or paste URL
                </label>
                <input
                  type="url"
                  name="twitterImage"
                  value={formData.twitterImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              {/* Image Preview */}
              {formData.twitterImage && (
                <div className="relative w-full bg-slate-800 rounded border border-slate-600 overflow-hidden">
                  <img
                    src={formData.twitterImage}
                    alt="Twitter Image Preview"
                    className="w-full h-auto max-h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={clearTwitterImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-500">
                Recommended: 1200x630px. Max 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Robots Meta */}
        <div className="border-t border-slate-700 pt-4 mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Robots Meta Tag
          </label>
          <select
            name="robots"
            value={formData.robots}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500"
          >
            <option value="index, follow">Index & Follow (Default)</option>
            <option value="noindex, follow">No Index, Follow</option>
            <option value="index, nofollow">Index, No Follow</option>
            <option value="noindex, nofollow">No Index, No Follow</option>
          </select>
        </div>

        {/* Favicon Section - Only for Home Page */}
        {(entitySlug === '/' || entitySlug === '' || entityTitle.toLowerCase().includes('home')) && (
          <div className="border-t border-slate-700 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-3">
              Browser Favicon
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-600 rounded text-slate-300 cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-all">
                {faviconUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {faviconFile ? faviconFile.name : 'Upload Favicon (ICO/PNG)'}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/x-icon,image/png,image/svg+xml"
                  onChange={handleFaviconUpload}
                  disabled={faviconUploading}
                  className="hidden"
                />
              </label>

              {formData.favicon && (
                <div className="flex items-center gap-4 p-3 bg-slate-800 rounded border border-slate-600">
                  <div className="w-10 h-10 bg-white p-1 rounded flex items-center justify-center">
                    <img
                      src={formData.favicon}
                      alt="Favicon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 truncate">{formData.favicon}</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFavicon}
                    className="p-1.5 bg-red-500 hover:bg-red-600 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500">
                Recommended: 32x32px or 16x16px. Format: .ico or .png
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={saveMutation.isPending || !formData.metaTitle.trim() || !formData.metaDescription.trim()}
        className="w-full px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-slate-600 text-white rounded font-medium transition"
      >
        {saveMutation.isPending ? 'Saving...' : 'Save SEO Metadata'}
      </button>
    </div>
  );
}
