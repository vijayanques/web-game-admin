import { apiClient } from './client';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  games?: Array<{
    id: number;
    title: string;
    description: string;
    genre: string;
    rating: number;
    price: number;
  }>;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  icon?: string;
  image?: File;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: File;
  isActive?: boolean;
}

export const categoryAPI = {
  // Fetch all categories with games (for admin - includes inactive)
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/api/categories/admin/all');
    return response.data.data;
  },

  // Fetch single category with games
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data.data;
  },

  // Create new category
  createCategory: async (payload: FormData | CreateCategoryPayload): Promise<Category> => {
    const response = await apiClient.post('/api/categories', payload);
    return response.data.data;
  },

  // Update category
  updateCategory: async (id: number, payload: FormData | UpdateCategoryPayload): Promise<Category> => {
    const response = await apiClient.put(`/api/categories/${id}`, payload);
    return response.data.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/categories/${id}`);
  },
};
