import React from 'react';
import { InteractiveMap } from './InteractiveMap';
import type {LatLngTuple} from "leaflet";

interface MapFieldProps {
    label?: string;
    description?: string;
    required?: boolean;
    error?: string;
    center?: LatLngTuple;
    zoom?: number;
    value?: LatLngTuple | null;
    onChange?: (position: LatLngTuple) => void;
    height?: string;
    readOnly?: boolean;
}

export const MapField: React.FC<MapFieldProps> = ({
    label = 'Location',
    description,
    required = false,
    error,
    center,
    zoom,
    value,
    onChange,
    height = '400px',
    readOnly = false,
}) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {description && (
                <p className="text-sm text-gray-600 mb-3">{description}</p>
            )}

            <div className={error ? 'border-2 border-red-500 rounded-lg' : ''}>
                <InteractiveMap
                    center={center}
                    zoom={zoom}
                    selectedPosition={value}
                    onLocationSelect={onChange}
                    height={height}
                    showCoordinates={true}
                    readOnly={readOnly}
                />
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};