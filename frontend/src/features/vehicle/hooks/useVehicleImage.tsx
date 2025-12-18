import type {VehicleResponse} from "../types/vehicle.types.ts";
import {useImageManagement} from "../../../hooks/file/useImageManagement.tsx";
import {vehicleImagesSchema} from "../schemas/vehicleSchema.ts";
import {vehicleService} from "../../../api/services/vehicleService.ts";
import React from "react";

export const useVehicleImages = (vehicle: VehicleResponse | null) => {
    const imageHook = useImageManagement({
        initialExistingImages: vehicle?.imageUrls ?? [],
        schema: vehicleImagesSchema,
    });

    const uploadImages = async (files: File[]) => {
        if (!vehicle?.id) return;

        const formData = new FormData();
        files.forEach(f => formData.append("images", f));

        await vehicleService.uploadVehicleImages(vehicle.id, formData);
    };

    const deleteImage = async (index: number) => {
        if (!vehicle?.id) return;
        // TODO: Get actual image id instead of just url (once vehicle details is merged)
        await vehicleService.deleteVehicleImage(vehicle.id, index);
        imageHook.removeExistingImage(index);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (vehicle) {
            await uploadImages(files);
        } else {
            imageHook.handleImageUpload(e);
        }
    };

    const validateForCreate = () => {
        if (imageHook.images.length === 0) {
            imageHook.setImageError("At least one vehicle image is required");
            return false;
        }
        return imageHook.validateImages();
    };

    return {
        ...imageHook,
        handleImageUpload,
        removeExistingImage: deleteImage,
        validateForCreate,
    };
};
