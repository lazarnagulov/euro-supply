import type { UserStateResponse, LoginRequest, RegistrationRequest, AuthResponse } from '../../features/auth/types/auth.types';
import apiClient from '../client';

export const authService = {

    login: async (data: LoginRequest): Promise<UserStateResponse> => {
        const response = await apiClient.post<UserStateResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegistrationRequest, image: File) : Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/users/registration', data);

        const formData = new FormData();
        formData.append("image", image);
        await apiClient.post(`/users/${response.data.id}/image`, formData, { headers: { "Content-Type": "multipart/form-data" }});

        return response.data;
    },

    verifyAccount: async (data: string): Promise<string> => {
        const response = await apiClient.patch<string>('users/verification', data);
        return response.data;
    }
}