import React from "react";
import { Upload } from "lucide-react";
import { ImagePreviewGrid } from "./ImagePreviewGrid.tsx";

export interface ImageUploadProps {
    images: File[];
    existingImages: Array<{ url: string }>;
    imageError: string;
    mode: "create" | "edit";
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
    onRemoveExistingImage: (index: number) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    images,
    existingImages,
    imageError,
    mode,
    onImageUpload,
    onRemoveImage,
    onRemoveExistingImage,
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Images {mode === "create" && "*"}
        </label>

        <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
                imageError ? "border-red-500" : "border-gray-300"
            }`}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                id="vehicle-images"
            />
            <label htmlFor="vehicle-images" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Click to upload vehicle images</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
            </label>
        </div>
        {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}

        {existingImages.length > 0 && (
            <ImagePreviewGrid
                title="Current Images"
                images={existingImages.map((img) => ({ src: img.url, type: "existing" }))}
                onRemove={onRemoveExistingImage}
            />
        )}

        {images.length > 0 && (
            <ImagePreviewGrid
                title="New Images"
                images={images.map((file) => ({
                    src: URL.createObjectURL(file),
                    name: file.name,
                    type: "new"
                }))}
                onRemove={onRemoveImage}
            />
        )}
    </div>
);