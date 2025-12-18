import React, { useState } from "react";
import type {ZodType} from "zod";

export interface UseImageManagementOptions<TExisting = string> {
    initialExistingImages?: TExisting[];
    maxImages?: number;
    schema?: ZodType<{ images: File[] }>;
    allowedTypes?: string[];
}

export const useImageManagement = <TExisting = string>({
    initialExistingImages = [],
    maxImages,
    schema,
    allowedTypes = ["image/"],
}: UseImageManagementOptions<TExisting>) => {
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] =
        useState<TExisting[]>(initialExistingImages);
    const [imageError, setImageError] = useState("");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const validFiles = files.filter(file =>
            allowedTypes.some(type => file.type.startsWith(type))
        );

        if (validFiles.length !== files.length) {
            setImageError("Only image files are allowed");
            return;
        }

        if (maxImages && images.length + validFiles.length > maxImages) {
            setImageError(`Maximum ${maxImages} images allowed`);
            return;
        }

        setImages(prev => [...prev, ...validFiles]);
        setImageError("");
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImageError("");
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const validateImages = () => {
        if (!schema) return true;

        const result = schema.safeParse({ images });
        if (!result.success) {
            setImageError(result.error.message);
            return false;
        }

        return true;
    };

    return {
        images,
        existingImages,
        imageError,

        setImages,
        setExistingImages,
        setImageError,

        handleImageUpload,
        removeImage,
        removeExistingImage,
        validateImages,
    };
};
