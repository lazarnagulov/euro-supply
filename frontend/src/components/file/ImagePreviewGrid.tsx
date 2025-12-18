import React from "react";
import { X } from "lucide-react";

export interface ImagePreviewGridProps {
    title: string;
    images: Array<{ src: string; name?: string; type: string }>;
    onRemove: (index: number) => void;
}

export const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({ title, images, onRemove }) => (
    <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>
        <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
                <div key={index} className="relative group">
                    <img
                        src={image.src}
                        alt={`${image.type} ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                    >
                        <X className="w-3 h-3" />
                    </button>
                    {image.name && (
                        <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                    )}
                </div>
            ))}
        </div>
    </div>
);