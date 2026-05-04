import { apiClient } from './client';
import { deleteCookie } from '@/lib/utils/cookies';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export const loginAdmin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/admin/login', credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutAdmin = async (): Promise<void> => {
  try {
    await apiClient.post('/api/admin/logout');
    deleteCookie('adminToken');
  } catch (error) {
    console.error('Logout error:', error);
    deleteCookie('adminToken');
  }
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/api/admin/verify');
    return response.data.success;
  } catch (error) {
    return false;
  }
};




