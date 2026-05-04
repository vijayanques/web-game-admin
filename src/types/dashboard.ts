export interface DashboardStats {
  totalUsers: number;
  totalGames: number;
  activePlayers: number;
  totalRevenue: number;
  avgSession: string;
  conversion: number;
  userGrowth: number;
  gameEngagement: number;
  playerRetention: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface GamePerformanceDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface DashboardData {
  stats: DashboardStats;
  userGrowthChart: ChartDataPoint[];
  revenueChart: ChartDataPoint[];
  activePlayersChart: ChartDataPoint[];
  revenueDistribution: ChartDataPoint[];
  gamePerformance: GamePerformanceDataPoint[];
}
