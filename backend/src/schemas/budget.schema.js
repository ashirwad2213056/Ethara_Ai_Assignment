import { z } from 'zod';

export const createBudgetSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Invalid category ID'),
    limitAmount: z.number().positive('Limit must be a positive number'),
    period: z.enum(['monthly', 'weekly']).default('monthly'),
  }),
});

export const updateBudgetSchema = z.object({
  body: z.object({
    limitAmount: z.number().positive('Limit must be a positive number').optional(),
    period: z.enum(['monthly', 'weekly']).optional(),
  }),
});
