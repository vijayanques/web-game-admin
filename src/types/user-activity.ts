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
  thumbnail: string;
  url: string;
  badge?: 'hot' | 'updated' | 'originals';
}

export interface TrackGamePlayPayload {
  userId: number;
  gameId: number;
  categoryId: number;
}

export interface TopPicksResponse {
  success: boolean;
  data: TopPickGame[];
}

export interface UserCategoryStats {
  categoryId: number;
  categoryName: string;
  playCount: number;
}
