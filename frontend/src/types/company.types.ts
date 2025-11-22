
export enum CompanyStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface Company {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    status: CompanyStatus;
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
    type: 'IMAGE' | 'DOCUMENT';
    uploadedAt: string;
}

export interface CompanyWithFiles extends Company {
    files: CompanyFile[];
}

export interface ReviewCompanyRequest {
    status: CompanyStatus;
    rejectionReason?: string;
}