import { apiClient } from './client';

export interface UserActivity {
  id: number;
  userId: number;
  gameId: number;
  categoryId: number;
  playedAt: string;
}

export interface TopPickGame {
  id: number;
  name: string;
  category: string;
  categoryId: number;
  thumbnail: string;
  url: string;
  badge?: 'hot' | 'updated' | 'originals';
}

export const userActivityAPI = {
  // Track user game play
  trackGamePlay: async (userId: number, gameId: number, categoryId: number): Promise<void> => {
    await apiClient.post('/api/user-activity', {
      userId,
      gameId,
      categoryId,
    });
  },

  // Get top picks for user
  getTopPicks: async (userId: number): Promise<TopPickGame[]> => {
    const response = await apiClient.get(`/api/top-picks?userId=${userId}`);
    return response.data.data;
  },
};
