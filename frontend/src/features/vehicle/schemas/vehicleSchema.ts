import { z } from 'zod';

export const vehicleSchema = z.object({
    registrationNumber: z
        .string()
        .min(1, 'Registration plate is required')
        .max(20, 'Registration plate must not exceed 20 characters')
        .regex(/^[A-Z0-9-]+$/i, 'Registration plate can only contain letters, numbers, and hyphens')
        .trim(),

    maxLoadKg: z
        .number()
        .positive('Max load must be greater than 0')
        .max(50000, 'Max load cannot exceed 50,000 kg')
        .or(z.string().min(1, 'Max load is required').transform(val => parseInt(val, 10)))
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Valid max load is required'),

    brandId: z
        .number()
        .positive('Please select a brand')
        .or(z.string().min(1, 'Please select a brand').transform(val => parseInt(val, 10)))
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Invalid brand selection'),

    modelId: z
        .number()
        .positive('Please select a model')
        .or(z.string().min(1, 'Please select a model').transform(val => parseInt(val, 10)))
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Invalid model selection'),
});

export const vehicleImagesSchema = z.object({
    images: z
        .array(z.instanceof(File))
        .min(1, 'At least one vehicle image is required')
        .refine(
            (files) => files.every((file) => file.type.startsWith('image/')),
            'Only image files are allowed'
        )
        .refine(
            (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
            'Each image must be less than 10MB'
        ),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type VehicleImagesData = z.infer<typeof vehicleImagesSchema>;
export const validateVehicle = (data: unknown) => {
    return vehicleSchema.safeParse(data);
};

export const validateVehicleImages = (data: unknown) => {
    return vehicleImagesSchema.safeParse(data);
};