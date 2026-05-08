// Default category definitions
// These match the seed data in backend/prisma/seed.js
// and the color palette in theme.js

export const CATEGORIES = [
  {
    id: 'food',
    name: 'Food & Drink',
    icon: 'restaurant',
    color: '#F5A623',
    key: 'food',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'car',
    color: '#4AABF5',
    key: 'transport',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'cart',
    color: '#E879B0',
    key: 'shopping',
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'medical',
    color: '#22C983',
    key: 'health',
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: 'home',
    color: '#7C6EF5',
    key: 'housing',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'film',
    color: '#F5515F',
    key: 'entertainment',
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'school',
    color: '#5DCDF5',
    key: 'education',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'ellipsis-horizontal',
    color: '#8E8BA8',
    key: 'other',
  },
];

/**
 * Get a category by its key name
 * @param {string} key
 */
export const getCategoryByKey = (key) =>
  CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];
