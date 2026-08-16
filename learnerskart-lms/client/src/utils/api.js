import axios from 'axios';

const getApiBaseUrl = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${hostname}:5001/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired tokens and automatic refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if unauthorized and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Attempt token refresh
          const res = await axios.post(getApiBaseUrl() + '/auth/refresh', { refreshToken });
          if (res.data.success && res.data.token) {
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token also failed - clear session
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('lk_token');
          localStorage.removeItem('user');
          localStorage.removeItem('lk_user');
          window.location.href = '/lms/login';
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('lk_token');
        localStorage.removeItem('user');
        localStorage.removeItem('lk_user');
        window.location.href = '/lms/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
