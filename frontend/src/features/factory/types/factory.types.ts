import type { FileResponse } from "../../../types/file.types";
import type { City, Country } from "../../../types/location.types";

export interface Factory {
    name: string;
    address: string;
    cityId: number;
    countryId: number;
    latitude: number;
    longitude: number;
}

export interface FactoryResponse {
    id: number;
    name: string;
    address: string;
    city: City;
    country: Country;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
    imageUrls: FileResponse[];
}

export interface FactorySearchParams {
    name?: string;
    address?: string;
    cityId?: number;
    countryId?: number;
}

export interface FactoryProductListItemDto {
    productId: number;
    productName: string;
    categoryName: string;
}

export interface FactoryAvailabilityDataPoint {
    timeLabel: string;
    online: boolean;
}

export interface FactoryAvailabilitySummary {
    dataPoints: FactoryAvailabilityDataPoint[];
    onlinePercentage: number;
    offlinePercentage: number;
    totalOnlineMinutes: number;
    totalOfflineMinutes: number;
}