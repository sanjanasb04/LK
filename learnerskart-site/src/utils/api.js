import axios from 'axios';

// Dynamically resolve API host based on user request (localhost or network IP)
const getApiBaseUrl = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${hostname}:5001/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = null;

// Getter for the in-memory access token
export const getAccessToken = () => accessToken;

// Setter for the in-memory access token
export const setAccessTokenInClient = (token) => {
  accessToken = token;
};

// Request Interceptor: Attach the token to every request
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 unauthorized errors (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token using the refresh cookie
        const response = await axios.post(
          `${getApiBaseUrl()}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken: newToken } = response.data;
        setAccessTokenInClient(newToken);

        // Update authorization header for the retried request
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token expired or invalid, logging out...', refreshError);
        
        // Clear token and trigger custom event to notify AuthContext to log out
        setAccessTokenInClient(null);
        window.dispatchEvent(new Event('auth-logout'));
        
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
