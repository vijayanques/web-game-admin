import { useState, useEffect } from 'react';
import { userActivityAPI, TopPickGame } from '@/lib/api/user-activity';

export function useTopPicks(userId?: number) {
  const [games, setGames] = useState<TopPickGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPicks = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await userActivityAPI.getTopPicks(userId);
        setGames(data);
      } catch (err) {
        console.error('Failed to fetch top picks:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchTopPicks();
  }, [userId]);

  const trackGamePlay = async (gameId: number, categoryId: number) => {
    if (!userId) return;
    
    try {
      await userActivityAPI.trackGamePlay(userId, gameId, categoryId);
    } catch (err) {
      console.error('Failed to track game play:', err);
    }
  };

  return { games, loading, error, trackGamePlay };
}
