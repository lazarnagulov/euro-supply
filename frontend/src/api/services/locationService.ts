import apiClient from '../client';
import type {City, Country} from "../../types/location.types.ts";

export const locationService = {

    getCountries: async (): Promise<Country[]> => {
        const response = await apiClient.get<Country[]>('/countries');
        return response.data;
    },

    getCountry: async (id: number): Promise<Country> => {
        const response = await apiClient.get<Country>(`/countries/${id}`);
        return response.data;
    },

    getCitiesByCountry: async (countryId: number): Promise<City[]> => {
        const response = await apiClient.get<City[]>(
            `/countries/${countryId}/cities`
        );
        return response.data;
    },

    getCity: async (cityId: number): Promise<City> => {
        const response = await apiClient.get<City>(`/cities/${cityId}`);
        return response.data;
    },

    searchCities: async (query: string, countryId?: number): Promise<City[]> => {
        const response = await apiClient.get<City[]>('/cities/search', {
            params: { query, countryId },
        });
        return response.data;
    },
};