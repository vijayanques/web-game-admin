'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Upload, Trash2, Edit2, Check, X, Sparkles } from 'lucide-react';
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
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-50 animate-pulse" />
            <div className="relative w-full h-full border-2 border-transparent border-t-purple-600 border-r-pink-600 rounded-full animate-spin" />
          </div>
          <p className="text-slate-400 text-sm font-[nunito]">Loading logos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Logo Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {['header', 'footer'].map((type) => {
          const logo = logos.find(l => l.type === type);
          const isEditing = editingId === logo?.id;
          const typeKey = type as 'header' | 'footer';

          return (
            <div
              key={type}
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-slate-800/80 shadow-lg hover:shadow-purple-600/10"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card Header */}
              <div className="relative bg-linear-to-r from-slate-800/80 to-slate-700/40 px-3 py-2 border-b border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${type === 'header' ? 'bg-blue-500' : 'bg-purple-500'} animate-pulse`} />
                    <h3 className="text-base font-bold text-white capitalize font-[nunito] tracking-tight">
                      {type} Logo
                    </h3>
                  </div>
                  {logo?.is_active && (
                    <span className="px-3   py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs text-green-400 font-semibold font-[nunito]">
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="relative p-3 space-y-3">
                {/* Logo Preview */}
                <div className="relative bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-600/50 hover:border-purple-500/50 flex items-center justify-center overflow-hidden transition-all duration-300 group/preview" style={{ minHeight: '100px' }}>
                  {logo?.url ? (
                    <>
                      <img
                        src={logo.url}
                        alt={logo.alt_text || `${type} logo`}
                        className="max-w-full max-h-full object-contain p-4 group-hover/preview:scale-105 transition-transform duration-300"
                      />
                      <div className=" absolute top-3 right-3 px-3 py-1.5 bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg text-xs text-green-300 font-semibold font-[nunito] backdrop-blur-sm">
                        Uploaded
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover/preview:bg-slate-700 transition-colors">
                        <Upload className=" cursor-pointer w-5 h-5 text-slate-500" />
                      </div>
                      <p className="text-slate-400 text-xs font-[nunito]">No logo uploaded yet</p>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <label className="block">
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
                    className=" cursor-pointer w-full px-2 py-1.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 group/btn font-[nunito]"
                  >
                    {uploadingType === typeKey ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs">Upload</span>
                      </>
                    )}
                  </button>
                </label>

                {/* Form Fields - Edit Mode */}
                {isEditing && logo ? (
                  <div className="space-y-2 pt-3 border-t border-slate-700/50">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300 font-[nunito]">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={formData[typeKey].alt_text}
                        onChange={(e) =>
                          handleInputChange(typeKey, 'alt_text', e.target.value)
                        }
                        className=" w-full px-2 py-1.5 bg-slate-900/50 border border-slate-600/50 hover:border-slate-600 focus:border-purple-500 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 font-[nunito]"
                        placeholder="e.g., Company Logo"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300 font-[nunito]">
                        Link URL
                      </label>
                      <input
                        type="text"
                        value={formData[typeKey].link_url}
                        onChange={(e) =>
                          handleInputChange(typeKey, 'link_url', e.target.value)
                        }
                        className="w-full px-2 py-1.5 bg-slate-900/50 border border-slate-600/50 hover:border-slate-600 focus:border-purple-500 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 font-[nunito]"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                ) : null}

                {/* Logo Info - View Mode */}
                {/* {logo && !isEditing && (
                  <div className="pt-5 border-t border-slate-700/50 space-y-3 text-sm">
                    <div className="flex justify-between items-start bg-slate-900/30 rounded-lg p-3">
                      <span className="text-slate-400 font-[nunito]">Alt Text:</span>
                      <span className="text-slate-200 text-right font-[nunito]">{logo.alt_text || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between items-start bg-slate-900/30 rounded-lg p-3">
                      <span className="text-slate-400 font-[nunito]">Link URL:</span>
                      <span className="text-slate-200 text-right truncate font-[nunito]">{logo.link_url || 'Not set'}</span>
                    </div>
                  </div>
                )} */}

                {/* Action Buttons */}
                {/* <div className="flex gap-3 pt-5 border-t border-slate-700/50">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(logo!)}
                        disabled={updateLogoMutation.isPending}
                        className="flex-1 px-4 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 hover:shadow-green-600/40 font-[nunito]"
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border border-slate-600/50 font-[nunito]"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {logo && (
                        <>
                          <button
                            onClick={() => handleEdit(logo)}
                            className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border border-slate-600/50 hover:border-slate-600 font-[nunito]"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => deleteLogoMutation.mutate(logo.id)}
                            disabled={deleteLogoMutation.isPending}
                            className="flex-1 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-red-600/30 hover:border-red-600/50 font-[nunito]"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {logos.length === 0 && (
        <div className="text-center py-16 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
          <div className="w-16 h-16 bg-linear-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-slate-400 text-lg font-[nunito] mb-2">No logos uploaded yet</p>
          <p className="text-slate-500 text-sm font-[nunito]">Upload your first logo to get started</p>
        </div>
      )}
    </div>
  );
}
