import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid({ message: 'Invalid category ID format' }),
    amount: z.number().positive({ message: 'Amount must be positive' }),
    title: z.string().min(1, { message: 'Title is required' }),
    note: z.string().optional(),
    date: z.string().datetime({ message: 'Invalid date format, must be ISO 8601' }),
  }),
});

export const updateExpenseSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Invalid expense ID format' }),
  }),
  body: z.object({
    categoryId: z.string().uuid({ message: 'Invalid category ID format' }).optional(),
    amount: z.number().positive({ message: 'Amount must be positive' }).optional(),
    title: z.string().min(1, { message: 'Title cannot be empty' }).optional(),
    note: z.string().optional(),
    date: z.string().datetime({ message: 'Invalid date format, must be ISO 8601' }).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

export const getExpensesQuerySchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    categoryId: z.string().uuid().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['date', 'amount', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
  }),
});
