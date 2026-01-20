import axios, {type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {ApiError} from "../types/api.types.ts";

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }

        if (error.response?.status === 403) {
            console.error('Access forbidden');
        }

        if (error.response?.status === 404) {
            console.error('Resource not found');
        }

        if (error.response?.status === 500) {
            console.error('Server error');
        }

        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'An error occurred',
            errors: error.response?.data?.errors,
            status: error.response?.status || 500,
        };

        return Promise.reject(apiError);
    }
);

export default apiClient;