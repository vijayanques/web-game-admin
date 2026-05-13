import { apiClient as client } from './client';

export interface AdConfig {
  id?: string;
  slot: string;
  adClient?: string;
  adSlot?: string;
  adType: string;
  responsive: boolean;
  status: boolean;
  imageUrl?: string;
  targetUrl?: string;
}

export const getAllAdConfigs = async () => {
  const response = await client.get('/api/adsense/all');
  return response.data;
};

export const upsertAdConfig = async (data: AdConfig) => {
  const response = await client.post('/api/adsense/upsert', data);
  return response.data;
};

export const deleteAdConfig = async (id: string) => {
  const response = await client.delete(`/api/adsense/${id}`);
  return response.data;
};
