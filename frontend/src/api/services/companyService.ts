import apiClient from '../client';
import type {
    Company,
    CompanyWithFiles,
    RegisterCompanyRequest,
    ReviewCompanyRequest
} from "../../types/company.types.ts";

export const companyService = {

    registerCompany: async (data: RegisterCompanyRequest): Promise<Company> => {
        const response = await apiClient.post<Company>('/api/v1/companies', data);
        return response.data;
    },

    uploadFiles: async (companyId: number, files: File[]): Promise<void> => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        await apiClient.post(
            `/api/v1/companies/${companyId}/files`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
    },

    getCompany: async (id: number): Promise<CompanyWithFiles> => {
        const response = await apiClient.get<CompanyWithFiles>(`/api/v1/companies/${id}`);
        return response.data;
    },

    getCompanies: async (params?: {
        page?: number;
        pageSize?: number;
        status?: string;
    }): Promise<Company[]> => {
        const response = await apiClient.get<Company[]>('/api/v1/companies', { params });
        return response.data;
    },

    updateStatus: async (
        id: number,
        data: ReviewCompanyRequest
    ): Promise<Company> => {
        const response = await apiClient.patch<Company>(
            `/api/v1/companies/${id}`,
            data
        );
        return response.data;
    },

};