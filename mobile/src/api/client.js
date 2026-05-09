import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─── Configuration ─────────────────────────────────────────────────────────────
// NOTE: Change this to your machine's local IP (e.g., 192.168.1.x) to test on a physical device.
// For Android Emulator, use 10.0.2.2.
const API_BASE_URL = 'https://spendwise.up.railway.app/api/v1';

// ─── Token helpers ─────────────────────────────────────────────────────────────
export const saveTokens = async (accessToken, refreshToken) => {
  await SecureStore.setItemAsync('access_token', accessToken);
  await SecureStore.setItemAsync('refresh_token', refreshToken);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('refresh_token');
};

export const getAccessToken = () => SecureStore.getItemAsync('access_token');
export const getRefreshToken = () => SecureStore.getItemAsync('refresh_token');

// ─── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor — attach access token ─────────────────────────────────
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — auto-refresh on 401 ────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          token: refreshToken,
        });

        await saveTokens(data.accessToken, data.refreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearTokens();
        // AuthContext will detect missing token and redirect to Login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
