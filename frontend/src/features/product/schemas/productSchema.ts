import { z } from 'zod';

export const productSchema = z.object({
    name: z
        .string()
        .min(2, 'Product name must be at least 2 characters')
        .max(50, 'Product name must not exceed 50 characters')
        .trim(),

    description: z
        .string()
        .min(5, 'Description must be at least 5 characters')
        .max(255, 'Description must not exceed 255 characters')
        .trim(),

    price: z
        .number()
        .positive('Price must be positive'),

    weight: z
        .number()
        .positive('Weight must be positive'),

    onSale: z.boolean(),

    categoryId: z
        .number()
        .int()
        .positive('Please select a category'),
});

export const imageSchema = z.object({
    image: z
        .instanceof(File)
        .refine(file => file.type.startsWith('image/'), 'Only image files are allowed')
        .refine(file => file.size <= 10 * 1024 * 1024, 'Image must be less than 10MB'),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ImageFormData = z.infer<typeof imageSchema>;
