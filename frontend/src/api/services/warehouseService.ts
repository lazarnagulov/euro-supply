import type { Warehouse, WarehouseSearchParams } from "../../features/warehouse/types/warehouse.type";
import apiClient from "../client";

export const warehouseService = {
     getWarehouses: async (page: number, size: number, params: WarehouseSearchParams) => {
        const isSearch = params && Object.keys(params).length !== 0;
        const response = await apiClient.get(
            isSearch ? '/warehouses/search' : '/warehouses',
            { params: { page, size, ...params } }
        );

        return response.data;
    },


    createWarehouse: async (request: Warehouse, images: File[]) => {
        const response = await apiClient.post('/warehouses', request);

        const formData = new FormData();
        images.forEach(img => formData.append('images', img));

        await apiClient.post(
            `/warehouses/${response.data.id}/images`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return response.data;
    },

    updateWarehouse: async (id: number, request: Warehouse) => {
        const response = await apiClient.put(`/warehouses/${id}`, request)
        return response.data
    },

    deleteWarehouse: async (id: number) => {
        await apiClient.delete(`/warehouses/${id}`);
    }
}