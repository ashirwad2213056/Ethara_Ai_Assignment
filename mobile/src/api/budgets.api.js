import api from './client.js';

export const budgetsApi = {
  list: () => api.get('/budgets'),
  upsert: (data) => api.post('/budgets', data),
  remove: (id) => api.delete(`/budgets/${id}`),
};
