import type {City, Country} from "../../../types/location.types.ts";
import type {FileResponse, StoredFile} from "../../../types/file.types.ts";


export enum RequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface Company {
    id: number;
    name: string;
    address: string;
    city: City;
    country: Country;
    latitude: number;
    longitude: number;
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterCompanyRequest {
    name: string;
    address: string;
    cityId: number;
    countryId: number;
    latitude: number;
    longitude: number;
}

export interface CompanyWithFiles extends Company {
    files: StoredFile[];
}

export interface ReviewCompanyRequest {
    status: RequestStatus;
    rejectionReason?: string;
}

export interface CompanyResponse {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    files: FileResponse[];
    owner: any;
    latitude: number;
    longitude: number;
}