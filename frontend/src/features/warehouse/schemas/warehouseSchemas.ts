import { z } from 'zod';

export const warehouseSchema = z.object({
    name: z.
        string()
        .min(1, 'Name is required')
        .max(20, 'Name must not exceed 20 characters')
        .regex(/^[A-Z0-9- ]+$/i, 'Name can only contain letters, numbers, hyphens and spaces')
        .trim(),

    address: z
        .string()
        .min(1, 'Address is required')
        .max(50, 'Address must not exceed 50 characters')
        .trim(),

    countryId: z
        .number()
        .positive('Please select a country')
        .or(z.string().min(1, 'Please select a country').transform(val => parseInt(val, 10)))
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Invalid country selection'),

    cityId: z
        .number()
        .positive('Please select a city')
        .or(z.string().min(1, 'Please select a city').transform(val => parseInt(val, 10)))
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Invalid city selection'),

    latitude: z
        .number()
        .min(-90, 'Invalid latitude')
        .max(90, 'Invalid latitude')
        .nullable()
        .refine((val) => val !== null, 'Please select location on the map'),

    longitude: z
        .number()
        .min(-180, 'Invalid longitude')
        .max(180, 'Invalid longitude')
        .nullable()
        .refine((val) => val !== null, 'Please select location on the map'),
});

export const warehouseImagesSchema = z.object({
    images: z
        .array(z.instanceof(File))
        .min(1, 'At least one warehouse image is required')
        .refine(
            (files) => files.every((file) => file.type.startsWith('image/')),
            'Only image files are allowed'
        )
        .refine(
            (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
            'Each image must be less than 10MB'
        ),
});

export type WarehouseFormData = z.infer<typeof warehouseSchema>;
export type WarehouseImagesData = z.infer<typeof warehouseImagesSchema>;
export const validateWarehouse = (data: unknown) => {
    return warehouseSchema.safeParse(data);
};

export const validateWarehouseImages = (data: unknown) => {
    return warehouseImagesSchema.safeParse(data);
};
