import type {City, Country} from "../../../types/location.types.ts";


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

export interface CompanyFile {
    id: number;
    filename: string;
    url: string;
    type: 'IMAGE' | 'PDF';
    uploadedAt: string;
}

export interface CompanyWithFiles extends Company {
    files: CompanyFile[];
}

export interface ReviewCompanyRequest {
    status: RequestStatus;
    rejectionReason?: string;
}