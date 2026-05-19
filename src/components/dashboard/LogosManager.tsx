'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Upload, Trash2, Edit2, Check, X } from 'lucide-react';
import { logoAPI, type Logo } from '@/lib/api/logos';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';

export default function LogosManager() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingType, setUploadingType] = useState<'header' | 'footer' | null>(null);

  const [formData, setFormData] = useState({
    header: { url: '', alt_text: '', link_url: '' },
    footer: { url: '', alt_text: '', link_url: '' }
  });

  // Fetch logos
  const { data: logos = [], isLoading } = useQuery({
    queryKey: ['logos'],
    queryFn: logoAPI.getAllLogos,
  });

  // Update logo mutation
  const updateLogoMutation = useMutation({
    mutationFn: async (data: { id: number; payload: any }) => {
      return logoAPI.updateLogo(data.id, data.payload);
    },
    onSuccess: () => {
      toast.success('Logo updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['logos'] });
      setEditingId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update logo');
    },
  });

  // Delete logo mutation
  const deleteLogoMutation = useMutation({
    mutationFn: logoAPI.deleteLogo,
    onSuccess: () => {
      toast.success('Logo deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['logos'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete logo');
    },
  });

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'header' | 'footer'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(type);
    try {
      const result = await uploadToCloudinary(file, 'theplayfree/logos');
      if (result.success && result.url) {
        const logo = logos.find(l => l.type === type);
        if (logo) {
          await updateLogoMutation.mutateAsync({
            id: logo.id,
            payload: { url: result.url }
          });
        } else {
          await logoAPI.createOrUpdateLogo({
            type,
            url: result.url,
            alt_text: `${type} Logo`,
            link_url: '/'
          });
          queryClient.invalidateQueries({ queryKey: ['logos'] });
        }
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploadingType(null);
    }
  };

  const handleSave = async (logo: Logo) => {
    const type = logo.type as 'header' | 'footer';
    const data = formData[type];

    await updateLogoMutation.mutateAsync({
      id: logo.id,
      payload: {
        alt_text: data.alt_text,
        link_url: data.link_url
      }
    });
  };

  const handleEdit = (logo: Logo) => {
    const type = logo.type as 'header' | 'footer';
    setFormData(prev => ({
      ...prev,
      [type]: {
        url: logo.url,
        alt_text: logo.alt_text || '',
        link_url: logo.link_url || ''
      }
    }));
    setEditingId(logo.id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleInputChange = (
    type: 'header' | 'footer',
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading logos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Logo Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['header', 'footer'].map((type) => {
          const logo = logos.find(l => l.type === type);
          const isEditing = editingId === logo?.id;
          const typeKey = type as 'header' | 'footer';

          return (
            <div
              key={type}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {type} Logo
              </h3>

              {/* Logo Preview */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center" style={{ minHeight: '150px' }}>
                {logo?.url ? (
                  <img
                    src={logo.url}
                    alt={logo.alt_text || `${type} logo`}
                    className="max-w-full object-contain"
                    style={{ maxHeight: '150px' }}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p>No logo uploaded</p>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="block mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, typeKey)}
                  disabled={uploadingType === typeKey}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector('input');
                    input?.click();
                  }}
                  disabled={uploadingType === typeKey}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingType === typeKey ? 'Uploading...' : 'Upload Logo'}
                </button>
              </label>

              {/* Form Fields */}
              {isEditing && logo ? (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={formData[typeKey].alt_text}
                      onChange={(e) =>
                        handleInputChange(typeKey, 'alt_text', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Logo alt text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link URL
                    </label>
                    <input
                      type="text"
                      value={formData[typeKey].link_url}
                      onChange={(e) =>
                        handleInputChange(typeKey, 'link_url', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleSave(logo!)}
                      disabled={updateLogoMutation.isPending}
                      className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {logo && (
                      <>
                        <button
                          onClick={() => handleEdit(logo)}
                          className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteLogoMutation.mutate(logo.id)}
                          disabled={deleteLogoMutation.isPending}
                          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Logo Info */}
              {logo && !isEditing && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Alt Text:</strong> {logo.alt_text || 'Not set'}
                  </p>
                  <p>
                    <strong>Link URL:</strong> {logo.link_url || 'Not set'}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        logo.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {logo.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
