import api from './client.js';

export const categoriesApi = {
  /** GET /categories */
  list: () => api.get('/categories'),

  /** POST /categories */
  create: (data) => api.post('/categories', data),
};
