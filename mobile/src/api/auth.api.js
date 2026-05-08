import api, { saveTokens, clearTokens } from './client.js';

export const authApi = {
  /** Register a new user */
  register: (data) => api.post('/auth/register', data),

  /** Login — returns { accessToken, refreshToken, user } */
  login: (email, password) => api.post('/auth/login', { email, password }),

  /** Exchange refresh token for new access + refresh tokens */
  refresh: (token) => api.post('/auth/refresh', { token }),

  /** Invalidate refresh token on backend */
  logout: (refreshToken) => api.post('/auth/logout', { token: refreshToken }),
};
