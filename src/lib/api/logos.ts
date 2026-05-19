import { apiClient } from './client';

export interface Logo {
  id: number;
  type: 'header' | 'footer';
  url: string;
  alt_text?: string;
  link_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLogoPayload {
  type: 'header' | 'footer';
  url: string;
  alt_text?: string;
  link_url?: string;
}

export interface UpdateLogoPayload {
  url?: string;
  alt_text?: string;
  link_url?: string;
  is_active?: boolean;
}

export const logoAPI = {
  // Fetch all logos
  getAllLogos: async (): Promise<Logo[]> => {
    const response = await apiClient.get('/api/logos');
    return response.data.data;
  },

  // Fetch logo by type
  getLogoByType: async (type: 'header' | 'footer'): Promise<Logo | null> => {
    const response = await apiClient.get(`/api/logos?type=${type}`);
    const logos = response.data.data;
    return logos.length > 0 ? logos[0] : null;
  },

  // Fetch single logo by ID
  getLogoById: async (id: number): Promise<Logo> => {
    const response = await apiClient.get(`/api/logos/${id}`);
    return response.data.data;
  },

  // Create or update logo
  createOrUpdateLogo: async (payload: CreateLogoPayload): Promise<Logo> => {
    const response = await apiClient.post('/api/logos', payload);
    return response.data.data;
  },

  // Update logo
  updateLogo: async (id: number, payload: UpdateLogoPayload): Promise<Logo> => {
    const response = await apiClient.put(`/api/logos/${id}`, payload);
    return response.data.data;
  },

  // Delete logo
  deleteLogo: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/logos/${id}`);
  },
};
