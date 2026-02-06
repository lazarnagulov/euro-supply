import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import AuthenticatedImage from "../auth/AuthenticatedImage.tsx";

interface ImageModalProps {
    images: Array<{ url: string }>;
    selectedIndex: number | null;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
    images,
    selectedIndex,
    onClose,
    onPrevious,
    onNext,
}) => {
    if (selectedIndex === null || !images || images.length === 0) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center z-50 justify-center px-4 pb-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
                aria-label="Close modal"
            >
                <X size={32}/>
            </button>

            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrevious();
                        }}
                        className="absolute left-4 text-white hover:text-gray-300 transition z-10 bg-black/50 rounded-full p-2"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={32}/>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        className="absolute right-4 text-white hover:text-gray-300 transition z-10 bg-black/50 rounded-full p-2"
                        aria-label="Next image"
                    >
                        <ChevronRight size={32}/>
                    </button>
                </>
            )}

            <div
                className="relative max-w-5xl max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <AuthenticatedImage
                    src={images[selectedIndex].url}
                    alt={`Image ${selectedIndex + 1}`}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
                <div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                    {selectedIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};