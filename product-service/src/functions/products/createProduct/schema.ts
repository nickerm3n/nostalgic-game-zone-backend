import { z } from 'zod';

export const productSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.number(),
  imageUrl: z.string().optional(),
});
