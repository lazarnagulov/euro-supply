import type { SectorTemperatureChartDto, TimeRangeRequest, Warehouse, WarehouseSearchParams } from "../../features/warehouse/types/warehouse.type";
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

    getSectorTemperatureStats: async ({warehouseId, sectorId, timeRange}: {warehouseId: number; sectorId: number; timeRange: TimeRangeRequest}) => {
        console.log('Fetching temperature stats with params:', { warehouseId, sectorId, timeRange });
        const response = await apiClient.get<SectorTemperatureChartDto[]>(`/warehouses/${warehouseId}/sector/${sectorId}`,{ params: timeRange });
        return response.data;
   },

    getWarehouseStatus: async (id: number) => {
        const response = await apiClient.get(`/warehouses/${id}/status`);
        return response.data;
    },

    getWarehouse: async (id: number) => {
        const response = await apiClient.get(`/warehouses/${id}`);
        return response.data;
    },

    getSectorsByWarehouse: async (warehouseId: number,page: number = 0, size: number = 10) => {
        const response = await apiClient.get(`/warehouses/${warehouseId}/sectors`, { params: { page, size } });
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