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
            `/vehicles/${id}/distances`,
            { params: request }
        );
        return vehicleResponse.data;
    },

    createVehicle: async (data: Vehicle, images: File[]) => {
        const vehicleResponse = await apiClient.post<VehicleResponse>('/vehicles', data);

        if (images.length === 0) {
            return { vehicle: vehicleResponse.data, imagesUploaded: true };
        }

        try {
            const formData = new FormData();
            images.forEach(img => formData.append('images', img));
            console.log(images);
            await apiClient.post(
                `/vehicles/${vehicleResponse.data.id}/images`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            return { vehicle: vehicleResponse.data, imagesUploaded: true };
        } catch (err) {
            return { vehicle: vehicleResponse.data, imagesUploaded: false };
        }
    },

    uploadVehicleImages: async (vehicleId: number, formData: FormData) => {
        await apiClient.post(
            `/vehicles/${vehicleId}/images`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return true;
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
    },

    deleteVehicleImage: async (id: number, imageId: number) => {
        await apiClient.delete(`/vehicles/${id}/images/${imageId}`);
    },

    deleteImages: async (id: number, imageIds: number[]) => {
        await apiClient.delete(`/vehicles/${id}/images`, {
            data: { imageIds }
        });
    },
};