import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    icon: z.string().min(1, { message: 'Icon is required' }),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex code (e.g., #FFFFFF)' }),
  }),
});
