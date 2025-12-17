import type {
    DistancePoint, DistanceRequest,
    Vehicle,
    VehicleBrand,
    VehicleModel,
    VehicleResponse,
    VehicleSearchParams
} from "../../features/vehicle/types/vehicle.types.ts";
import apiClient from "../client.ts";

export const vehicleService = {
    getVehicles: async (page: number, size: number, params: VehicleSearchParams) => {
        const isSearch = params && Object.keys(params).length !== 0;
        const response = await apiClient.get(
            isSearch ? '/vehicles/search' : '/vehicles',
            { params: { page, size, ...params } }
        );

        return response.data;
    },

    getVehicle: async (id: number) => {
        const response = await  apiClient.get(
            `/vehicles/${id}`
        );
        return response.data;
    },

    getBrands: async () => {
        const response = await apiClient.get<VehicleBrand[]>('/vehicles/brands');
        return response.data;
    },

    getModelsByBrand: async (brandId: number) => {
        const response = await apiClient.get<VehicleModel[]>(
            `/vehicles/brands/${brandId}/models`
        );
        return response.data;
    },

    getDistances: async (id: number, request: DistanceRequest) => {
        const vehicleResponse = await apiClient.get<DistancePoint[]>(
            `/api/v1/vehicles/${id}/distances`,
            { params: request }
        );
        return vehicleResponse.data;
    },

    createVehicle: async (data: Vehicle, images: File[]) => {
        const vehicleResponse = await apiClient.post<VehicleResponse>(
            '/vehicles',
            data
        );

        const formData = new FormData();
        images.forEach(img => formData.append('images', img));

        await apiClient.post(
            `/vehicles/${vehicleResponse.data.id}/images`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return vehicleResponse.data;
    },

    updateVehicle: async (id: number, data: Vehicle) => {
        const vehicleResponse = await apiClient.put<VehicleResponse>(
            `/vehicles/${id}`,
            data
        );
        return vehicleResponse.data
    },

    deleteVehicle: async (id: number) => {
        await apiClient.delete(`/vehicles/${id}`);
    }
};