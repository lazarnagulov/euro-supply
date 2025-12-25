export interface Country {
    id: number;
    name: string;
    code?: string;
}

export interface City {
    id: number;
    name: string;
    countryId: number;
}

export interface MapLocation {
    latitude: number;
    longitude: number;
    timestamp: number;
}