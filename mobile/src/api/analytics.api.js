import api from './client.js';

export const analyticsApi = {
  summary: () => api.get('/analytics/summary'),
  distribution: () => api.get('/analytics/distribution'),
  trends: () => api.get('/analytics/trends'),
};
