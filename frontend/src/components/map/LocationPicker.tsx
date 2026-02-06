import React from "react";
import { Marker, useMapEvents } from 'react-leaflet';
import type {LatLngTuple} from 'leaflet';

interface LocationPickerProps {
    position: LatLngTuple | null;
    onLocationSelect?: (position: LatLngTuple) => void;
    readOnly?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ position, onLocationSelect, readOnly = false }) => {
    useMapEvents({
        click(e) {
            if (!readOnly && onLocationSelect) {
                const newPosition: LatLngTuple = [e.latlng.lat, e.latlng.lng];
                onLocationSelect(newPosition);
            }
        },
    });

    return position ? <Marker position={position} /> : null;
};