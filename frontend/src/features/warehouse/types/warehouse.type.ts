import type { FileResponse } from "../../../types/file.types";
import type { City, Country } from "../../../types/location.types";

export interface Warehouse {
    name: string;
    address: string;
    countryId: number;
    cityId: number;
}

export interface WarehouseResponse {
    id: number;
    name: string;
    address: string;
    country: Country;
    city: City;
    latitude: number;
    longitude: number;
    imageUrls: FileResponse[];
}

export interface WarehouseSearchParams {
    name?: string;
    address?: string;
    cityId?: number;
    countryId?: number;
}