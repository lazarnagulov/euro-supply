import apiClient from '../client';
import type {City, Country} from "../../types/location.types.ts";

export const locationService = {

    getCountries: async (): Promise<Country[]> => {
        const response = await apiClient.get<Country[]>('/api/v1/countries');
        return response.data;
    },

    getCountry: async (id: number): Promise<Country> => {
        const response = await apiClient.get<Country>(`/api/v1/countries/${id}`);
        return response.data;
    },

    getCitiesByCountry: async (countryId: number): Promise<City[]> => {
        const response = await apiClient.get<City[]>(
            `/api/v1/countries/${countryId}/cities`
        );
        return response.data;
    },

    getCity: async (cityId: number): Promise<City> => {
        const response = await apiClient.get<City>(`/api/v1/cities/${cityId}`);
        return response.data;
    },

    searchCities: async (query: string, countryId?: number): Promise<City[]> => {
        const response = await apiClient.get<City[]>('/api/v1/cities/search', {
            params: { query, countryId },
        });
        return response.data;
    },
};