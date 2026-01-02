import type {
    Factory,
    FactoryResponse,
    FactorySearchParams
} from "../../features/factory/types/factory.types.ts";
import type { FileResponse } from "../../types/file.types.ts";
import apiClient from "../client.ts";

export const factoryService = {
    getFactories: async (page: number, size: number, params: FactorySearchParams) => {
        const isSearch = params && Object.keys(params).length !== 0;
        const response = await apiClient.get(
            isSearch ? '/factories/search' : '/factories',
            { params: { page, size, ...params } }
        );
        return response.data;
    },

    getFactory: async (id: number) => {
        const response = await apiClient.get<FactoryResponse>(
            `/factories/${id}`
        );
        return response.data;
    },

    getFactoriesByProductId: async (productId: number) => {
        const response = await apiClient.get(`/factories/producing-product/${productId}`);
        return response.data;
    },

    createFactory: async (data: Factory, images: File[]) => {
        const factoryResponse = await apiClient.post<FactoryResponse>(
            '/factories',
            data
        );

        if (images.length > 0) {
            const formData = new FormData();
            images.forEach(img => formData.append('images', img));

            await apiClient.post(
                `/factories/${factoryResponse.data.id}/images`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
        }

        return factoryResponse.data;
    },

    updateFactory: async (id: number, data: Factory) => {
        const response = await apiClient.put<FactoryResponse>(
            `/factories/${id}`,
            data
        );
        return response.data;
    },

    deleteImages: async (factoryId: number, imageIds: number[]) => {
        await apiClient.delete(`/factories/${factoryId}/images`, {
            data: { imageIds }
        });
    },

    uploadImages: async (factoryId: number, formData: FormData) => {
        const response = await apiClient.post<FileResponse[]>(
            `/factories/${factoryId}/images`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    },

    deleteFactory: async (id: number) => {
        await apiClient.delete(`/factories/${id}`);
    }
};