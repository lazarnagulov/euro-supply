import type {MapLocation} from "../../../types/location.types.ts";

export interface Vehicle {
    registrationNumber: string;
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
    registrationNumber: string;
    maxLoadKg: number;
    brand: VehicleBrand;
    model: VehicleModel;
    imageUrls: string[];
    lastLocation?: MapLocation;
}

export interface VehicleSearchParams {
    registration?: string;
    brandId?: number;
    modelId?: number;
    minLoad?: number;
    maxLoad?: number;
}

export interface DistanceRequest {
    start?: string;
    end?: string;
}

export type DistanceAggregation = "7d" | "30d" | "90d" | "180d" | "365d";

export interface DistancePoint {
    time: string;
    distance: number;
}