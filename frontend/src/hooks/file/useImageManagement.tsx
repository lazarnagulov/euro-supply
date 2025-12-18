import React, { useState } from "react";
import type { VehicleResponse } from "../../features/vehicle/types/vehicle.types.ts";
import { vehicleImagesSchema } from "../../features/vehicle/schemas/vehicleSchema.ts";

export const useImageManagement = (vehicle: VehicleResponse | null) => {
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState(vehicle?.imageUrls || []);
    const [imageError, setImageError] = useState("");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));

        if (imageFiles.length !== files.length) {
            setImageError("Only image files are allowed");
        } else {
            setImageError("");
        }

        setImages((prev) => [...prev, ...imageFiles]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImageError("");
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const validateImages = (mode: string) => {
        if (mode === "create" && images.length === 0) {
            setImageError("At least one vehicle image is required");
            return false;
        }

        if (images.length > 0) {
            const imageValidation = vehicleImagesSchema.safeParse({ images });
            if (!imageValidation.success) {
                setImageError(imageValidation.error.message);
                return false;
            }
        }

        return true;
    };

    return {
        images,
        setImages,
        existingImages,
        imageError,
        setImageError,
        handleImageUpload,
        removeImage,
        removeExistingImage,
        validateImages,
    };
};