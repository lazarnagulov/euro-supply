import apiClient from '../client';
import type { CreateProductRequest, Product } from '../../features/product/types/product.types';

export const productService = {

    createProduct: async (data: CreateProductRequest): Promise<Product> => {
        const response = await apiClient.post<Product>('/products', data);
        return response.data;
    },

    uploadImage: async (productId: number, image: File): Promise<void> => {
        const formData = new FormData();
        formData.append('image', image);

        await apiClient.post(
            `/products/${productId}/image`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
    },
};
