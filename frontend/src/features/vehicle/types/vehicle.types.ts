export interface Vehicle {
    registrationPlate: string;
    maxLoadKg: number;
    brandId: number;
    modelId: number;
}

export interface VehicleBrand {
    id: number;
    name: string;
}

export interface VehicleModel {
    id: number;
    name: string;
}

export interface VehicleResponse {
    id: number;
    registrationPlate: string;
    maxLoadKg: number;
    brand: VehicleBrand;
    model: VehicleModel;
    imageUrls: string[];
}

export interface VehicleSearchParams {
    registration?: string;
    brandId?: number;
    modelId?: number;
    minLoad?: number;
    maxLoad?: number;
    search?: string;
}

