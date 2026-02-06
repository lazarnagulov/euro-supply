import { z } from 'zod';

export const companyRegistrationSchema = z.object({
    name: z
        .string()
        .min(2, 'Company name must be at least 2 characters')
        .max(50, 'Company name must not exceed 50 characters')
        .trim(),

    address: z
        .string()
        .min(2, 'Address must be at least 2 characters')
        .max(50, 'Address must not exceed 50 characters')
        .trim(),

    countryId: z
        .number()
        .int()
        .positive('Please select a country'),

    cityId: z
        .number()
        .int()
        .positive('Please select a city'),

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

export const fileValidationSchema = z.object({
    companyImages: z
        .array(z.instanceof(File))
        .min(1, 'Please upload at least one company image')
        .refine(
            (files) => files.every((file) => file.type.startsWith('image/')),
            'Only image files are allowed for company images'
        )
        .refine(
            (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
            'Each image must be less than 10MB'
        ),

    documents: z
        .array(z.instanceof(File))
        .min(1, 'Please upload at least one ownership document')
        .refine(
            (files) => files.every((file) =>
                file.type === 'application/pdf' || file.type.startsWith('image/')
            ),
            'Only PDF and image files are allowed for documents'
        )
        .refine(
            (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
            'Each document must be less than 10MB'
        ),
});

export const fullCompanyRegistrationSchema = companyRegistrationSchema.and(fileValidationSchema);

export type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;
export type FileValidationData = z.infer<typeof fileValidationSchema>;
export type FullCompanyRegistrationData = z.infer<typeof fullCompanyRegistrationSchema>;

export const validateCompanyRegistration = (data: unknown) => {
    return companyRegistrationSchema.safeParse(data);
};

export const validateFiles = (data: unknown) => {
    return fileValidationSchema.safeParse(data);
};