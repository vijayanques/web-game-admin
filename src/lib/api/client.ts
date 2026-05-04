import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.118:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to handle FormData and auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from cookies if available
    if (typeof window !== 'undefined') {
      // Get token from cookie (Next.js cookies are automatically sent with requests)
      // The cookie will be sent automatically by the browser
      const cookieString = document.cookie;
      const adminTokenMatch = cookieString.match(/adminToken=([^;]+)/);
      if (adminTokenMatch) {
        const token = adminTokenMatch[1];
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log the request data
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      isFormData: config.data instanceof FormData
    });
    
    // Don't set Content-Type for FormData - let axios handle it
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
