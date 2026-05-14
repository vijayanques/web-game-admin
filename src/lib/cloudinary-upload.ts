/**
 * Cloudinary Upload Utility
 * Handles uploading images to Cloudinary and returning the URL
 */

interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload image to Cloudinary
 * Uses backend API for signed uploads
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'theplayfree/seo'
): Promise<UploadResult> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image',
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB',
      };
    }

    // Create FormData for backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Get API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const uploadUrl = `${apiUrl}/api/upload/cloudinary`;

    // Upload via backend (which handles signing)
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Upload failed',
      };
    }

    const data = await response.json();

    if (!data.success || !data.url) {
      return {
        success: false,
        error: data.message || 'Upload failed',
      };
    }

    // Return the secure URL with optimization parameters
    const optimizedUrl = `${data.url.replace('/upload/', '/upload/c_fill,w_1200,h_630,q_auto/')}`;

    return {
      success: true,
      url: optimizedUrl,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload multiple images in parallel
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder: string = 'theplayfree/seo'
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadToCloudinary(file, folder)));
}

/**
 * Get optimized Cloudinary URL
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  width: number = 1200,
  height: number = 630
): string {
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Check if already has transformation
  if (url.includes('/c_')) {
    return url;
  }

  // Add transformation
  return url.replace('/upload/', `/upload/c_fill,w_${width},h_${height},q_auto/`);
}
