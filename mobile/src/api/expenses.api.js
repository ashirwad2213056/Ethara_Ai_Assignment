import api from './client.js';

export const expensesApi = {
  /** GET /expenses with optional filters */
  list: (params) => api.get('/expenses', { params }),

  /** POST /expenses */
  create: (data) => api.post('/expenses', data),

  /** GET /expenses/:id */
  getById: (id) => api.get(`/expenses/${id}`),

  /** PUT /expenses/:id */
  update: (id, data) => api.put(`/expenses/${id}`, data),

  /** DELETE /expenses/:id */
  remove: (id) => api.delete(`/expenses/${id}`),
};
