import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.118:8000';

// Log the API URL on initialization (only once)
if (typeof window !== 'undefined') {
  console.log('🔧 Dashboard API Configuration:', {
    API_URL,
    env: process.env.NEXT_PUBLIC_API_URL,
    endpoint: `${API_URL}/api/admin/dashboard/stats`
  });
}

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

export interface GamePerformanceData {
  name: string;
  value: number;
  [key: string]: number | string;
}

export interface DashboardData {
  stats: DashboardStats;
  userGrowthChart: ChartDataPoint[];
  revenueChart: ChartDataPoint[];
  activePlayersChart: ChartDataPoint[];
  revenueDistribution: ChartDataPoint[];
  gamePerformance: GamePerformanceData[];
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    console.log('🔄 Fetching dashboard data from:', `${API_URL}/api/admin/dashboard/stats`);
    
    // Call backend directly
    const response = await axios.get(`${API_URL}/api/admin/dashboard/stats`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Dashboard data received:', response.data);
    
    // Backend returns data directly, not wrapped in success/data
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
    }
    
    throw error;
  }
}
