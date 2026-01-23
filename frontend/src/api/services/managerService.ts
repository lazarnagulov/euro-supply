import type { RegistrationRequest } from "../../features/auth/types/auth.types.ts";
import apiClient from "../client";

export const managerService = {

    getManagers: async (page: number, size: number, keyword?: string) => {
        const params = {
            page,
            size,
            ...(keyword?.trim() ? { keyword: keyword.trim() } : ""),
        };

        const response = await apiClient.get("/users/managers", { params });
        return response.data;
    },

    suspendManager: async (id: number): Promise<void> => {
        await apiClient.patch(`/users/${id}/suspension`);
    },

    async createManager(
        data: RegistrationRequest, 
        profileImage: File
    ): Promise<{ manager: any; imageUploaded: boolean }> {
        try {
            const managerData = {
                username: data.username,
                email: data.email,
                password: data.password,
                passwordConfirmation: data.passwordConfirmation,
                person: {
                    firstname: data.person.firstname,
                    lastname: data.person.lastname,
                    phoneNumber: data.person.phoneNumber,
                },
            };

            const response = await apiClient.post("users/managers", managerData);
            const createdManager = response.data;

            try {
                await this.uploadManagerImage(createdManager.id, profileImage);
                return { manager: createdManager, imageUploaded: true };
            } catch (imageError) {
                console.error("Image upload failed:", imageError);
                return { manager: createdManager, imageUploaded: false };
            }
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Failed to create manager"
            );
        }
    },

    uploadManagerImage: async (id: number, image: File): Promise<void> => {
        const formData = new FormData();
        formData.append("image", image);

        await apiClient.post(
            `/users/${id}/image`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },
};