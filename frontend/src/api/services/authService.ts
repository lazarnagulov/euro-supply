import type { UserStateResponse, LoginRequest } from '../../features/auth/types/auth.types';
import apiClient from '../client';

export const authService = {

    login: async (data: LoginRequest): Promise<UserStateResponse> => {
        const response = await apiClient.post<UserStateResponse>('/auth/login', data);
        return response.data;
    },
}