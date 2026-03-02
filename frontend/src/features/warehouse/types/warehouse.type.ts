import type { FileResponse } from "../../../types/file.types";
import type { City, Country } from "../../../types/location.types";

export interface Warehouse {
    name: string;
    address: string;
    countryId: number;
    cityId: number;
    sectors?: Sector[];
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
    sectors: SectorResponse[]
}

export interface TimeRangeRequest {
  period?: string; 
  start?: string;  
  end?: string;   
}

export interface SectorTemperatureChartDto {
  timestamp: string;          
  temperature: number;        
}

export interface WarehouseSectors {
    id: number;
    name: string;
    lastTemperature: number;
}

export interface WarehouseSearchParams {
    name?: string;
    address?: string;
    cityId?: number;
    countryId?: number;
}

export interface Sector {
    id?: number;
    name: string;
}

export interface SectorResponse {
    id: number;
    name: string;
}