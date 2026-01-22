import type { RegistrationRequest } from "../../features/auth/types/auth.types.ts";
import type { ManagerSearchParams } from "../../features/manager/types/manager.types.ts";
import apiClient from "../client";

export const managerService = {

    getManagers: async (page: number, size: number, params: ManagerSearchParams) => {
      const isSearch = params && Object.keys(params).length !== 0;
      const response = await apiClient.get(
        isSearch ? "/users/managers/search" : "/users/managers",
        { params: { page, size, ...params } }
      );
      console.log("ManagerService - getManagers response:", response.data);
      return response.data;
    },

    suspendManager: async (id: number): Promise<void> => {
        await apiClient.post(`/managers/${id}/suspend`);
    },

    async createManager(
        data: RegistrationRequest, 
        profileImage: File
    ): Promise<{ manager: any; imageUploaded: boolean }> {
        try {
            // basic info
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
            console.log("Creating manager with data:", managerData);

            const response = await apiClient.post("users/managers", managerData);
            const createdManager = response.data;

            console.log("Manager created:", createdManager);

            // upload profile image
            try {
                await this.uploadManagerImage(createdManager.id, profileImage);
                return { manager: createdManager, imageUploaded: true };
            } catch (imageError) {
                // TODO: propagte error properly
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