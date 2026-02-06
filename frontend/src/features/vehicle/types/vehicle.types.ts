import type {FileResponse} from "../../../types/file.types.ts";

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
    lastLocation?: MapLocation;
    imageUrls: FileResponse[];
    online: boolean;
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

export interface DistancePoint {
    time: string;
    distance: number;
}

export interface AvailabilityDataPoint {
    label: string;
    timestamp: string;
    onlineMinutes: number;
    offlineMinutes: number;
    onlinePercentage: number;
}

export interface AvailabilitySummary {
    totalOnlineMinutes: number;
    totalOfflineMinutes: number;
    onlinePercentage: number;
    offlinePercentage: number;
    dataPoints: AvailabilityDataPoint[];
}