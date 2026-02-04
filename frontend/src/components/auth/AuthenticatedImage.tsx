import React, { useState, useEffect } from 'react';
import apiClient from "../../api/client.ts";

interface AuthenticatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallback?: React.ReactNode;
}

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
    src,
    alt,
    fallback,
    className,
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        let objectUrl: string | null = null;

        const fetchImage = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await apiClient.get(src, {
                    responseType: 'blob',
                    signal: controller.signal,
                });

                if (isMounted) {
                    objectUrl = URL.createObjectURL(response.data);
                    setImageSrc(objectUrl);
                    setLoading(false);
                }
            } catch (err: any) {
                if (isMounted && err.name !== 'CanceledError') {
                    console.error('Failed to load image:', err);
                    setError(true);
                    setLoading(false);
                }
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
            controller.abort();
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]);

    if (loading) {
        return (
            <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !imageSrc) {
        return fallback ? (
            <>{fallback}</>
        ) : (
            <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
                <span className="text-gray-400 text-sm">Failed to load</span>
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            {...props}
        />
    );
};

export default AuthenticatedImage;