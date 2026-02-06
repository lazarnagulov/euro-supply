import { z } from 'zod';

export const factorySchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .trim(),

    address: z
        .string()
        .min(2, 'Address must be at least 2 characters')
        .max(50, 'Address must not exceed 50 characters')
        .trim(),

    cityId: z
        .number()
        .positive('Please select a city')
        .or(z.string().min(1, 'Please select a city').transform(val => parseInt(val, 10)))
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Invalid city selection'),

    countryId: z
        .number()
        .positive('Please select a country')
        .or(z.string().min(1, 'Please select a country').transform(val => parseInt(val, 10)))
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Invalid country selection'),

    latitude: z
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90'),

    longitude: z
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180'),
});

export type FactoryFormData = z.infer<typeof factorySchema>;

export const validateFactory = (data: unknown) => {
    return factorySchema.safeParse(data);
};