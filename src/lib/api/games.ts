import { apiClient } from './client';

export interface Game {
  id: number;
  title: string;
  slug?: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  genre: string;
  rating: number;
  thumbnail: string;
  videoUrl?: string;
  gameUrl: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGamePayload {
  title: string;
  categoryId: number;
  genre: string;
  rating?: number;
  thumbnail?: File | string;
  gameUrl: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateGamePayload {
  title?: string;
  categoryId?: number;
  genre?: string;
  rating?: number;
  thumbnail?: File | string;
  gameUrl?: string;
  description?: string;
  isActive?: boolean;
}

export const gameAPI = {
  // Fetch all games
  getAllGames: async (): Promise<Game[]> => {
    const response = await apiClient.get('/api/games');
    return response.data.data;
  },

  // Fetch single game
  getGameById: async (id: number): Promise<Game> => {
    const response = await apiClient.get(`/api/games/${id}`);
    return response.data.data;
  },

  // Create new game
  createGame: async (payload: FormData | CreateGamePayload): Promise<Game> => {
    const response = await apiClient.post('/api/games', payload);
    return response.data.data;
  },

  // Update game
  updateGame: async (id: number, payload: FormData | UpdateGamePayload): Promise<Game> => {
    const response = await apiClient.put(`/api/games/${id}`, payload);
    return response.data.data;
  },

  // Delete game
  deleteGame: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/games/${id}`);
  },
};
