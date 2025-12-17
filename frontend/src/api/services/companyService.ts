import apiClient from '../client';
import type {
    Company, CompanyResponse,
    RegisterCompanyRequest,
    ReviewCompanyRequest
} from "../../features/company/types/company.types.ts";
import type {PagedResponse} from "../../types/api.types.ts";

export const companyService = {

    registerCompany: async (data: RegisterCompanyRequest): Promise<Company> => {
        const response = await apiClient.post<Company>('/companies', data);
        return response.data;
    },

    uploadFiles: async (companyId: number, files: File[]): Promise<void> => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        await apiClient.post(
            `/companies/${companyId}/files`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
    },

    getPendingCompanies: async (page: number, size: number) => {
        const response = await apiClient.get<PagedResponse<CompanyResponse>>(
            '/companies/pending',
            { params: { page, size } }
        );
        return response.data;
    },


    updateStatus: async (
        id: number,
        data: ReviewCompanyRequest
    ): Promise<Company> => {
        const response = await apiClient.patch<Company>(
            `/companies/${id}`,
            data
        );
        return response.data;
    },

};