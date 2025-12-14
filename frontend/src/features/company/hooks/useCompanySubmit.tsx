import { useState } from 'react';
import { validateFiles } from '../schemas/companySchema';
import type {Company, RegisterCompanyRequest} from "../types/company.types.ts";
import {companyService} from "../../../api/services/companyService.ts";

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface SubmitResult {
    success: boolean;
    data?: Company;
    error?: string;
}

export const useCompanySubmit = () => {
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const submitCompany = async (
        formData: Omit<RegisterCompanyRequest, 'countryId' | 'cityId'> & {
            countryId: string | number;
            cityId: string | number;
        },
        files: {
            companyImages: File[];
            documents: File[];
        }
    ): Promise<SubmitResult> => {
        setStatus('loading');
        setError(null);

        try {
            const fileValidation = validateFiles(files);
            if (!fileValidation.success) {
                throw new Error(fileValidation.error.message);
            }

            const companyData: RegisterCompanyRequest = {
                name: formData.name,
                address: formData.address,
                cityId: typeof formData.cityId === 'string'
                    ? parseInt(formData.cityId, 10)
                    : formData.cityId,
                countryId: typeof formData.countryId === 'string'
                    ? parseInt(formData.countryId, 10)
                    : formData.countryId,
                latitude: formData.latitude,
                longitude: formData.longitude,
            };
            const company = await companyService.registerCompany(companyData);

            const allFiles = [...files.companyImages, ...files.documents];
            if (allFiles.length > 0) {
                await companyService.uploadFiles(company.id, allFiles);
            }

            setStatus('success');
            return {
                success: true,
                data: company,
            };
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to submit company registration';

            setStatus('error');
            setError(errorMessage);

            console.error('Company submission error:', err);

            return {
                success: false,
                error: errorMessage,
            };
        }
    };

    const resetStatus = () => {
        setStatus('idle');
        setError(null);
    };

    return {
        status,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        error,
        submitCompany,
        resetStatus,
    };
};