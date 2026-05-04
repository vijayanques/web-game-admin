// Example test file for user activity API
// You can use this with Jest or Vitest

import { userActivityAPI } from '../user-activity';

describe('User Activity API', () => {
  describe('trackGamePlay', () => {
    it('should track game play successfully', async () => {
      const userId = 1;
      const gameId = 5;
      const categoryId = 2;

      // Mock the API call
      const mockPost = jest.spyOn(require('../client').apiClient, 'post');
      mockPost.mockResolvedValue({ data: { success: true } });

      await userActivityAPI.trackGamePlay(userId, gameId, categoryId);

      expect(mockPost).toHaveBeenCalledWith('/api/user-activity', {
        userId,
        gameId,
        categoryId,
      });
    });

    it('should handle errors gracefully', async () => {
      const mockPost = jest.spyOn(require('../client').apiClient, 'post');
      mockPost.mockRejectedValue(new Error('Network error'));

      await expect(
        userActivityAPI.trackGamePlay(1, 5, 2)
      ).rejects.toThrow('Network error');
    });
  });

  describe('getTopPicks', () => {
    it('should fetch top picks for user', async () => {
      const userId = 1;
      const mockGames = [
        {
          id: 1,
          name: 'Test Game',
          category: 'Action',
          thumbnail: '/test.jpg',
          url: '/game/test',
        },
      ];

      const mockGet = jest.spyOn(require('../client').apiClient, 'get');
      mockGet.mockResolvedValue({ data: { data: mockGames } });

      const result = await userActivityAPI.getTopPicks(userId);

      expect(mockGet).toHaveBeenCalledWith(`/api/top-picks?userId=${userId}`);
      expect(result).toEqual(mockGames);
    });

    it('should return empty array when no recommendations', async () => {
      const mockGet = jest.spyOn(require('../client').apiClient, 'get');
      mockGet.mockResolvedValue({ data: { data: [] } });

      const result = await userActivityAPI.getTopPicks(1);

      expect(result).toEqual([]);
    });
  });
});
