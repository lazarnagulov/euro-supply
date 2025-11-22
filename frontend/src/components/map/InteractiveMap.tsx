import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type {LatLngTuple} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationPicker } from './LocationPicker';
import {MAP_DEFAULTS} from "../../config/map.config.ts";

interface InteractiveMapProps {
    center?: LatLngTuple;
    zoom?: number;
    selectedPosition?: LatLngTuple | null;
    onLocationSelect?: (position: LatLngTuple) => void;
    height?: string;
    className?: string;
    showCoordinates?: boolean;
    readOnly?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center = MAP_DEFAULTS.center,
  zoom = MAP_DEFAULTS.zoom,
  selectedPosition = null,
  onLocationSelect,
  height = MAP_DEFAULTS.height,
  className = '',
  showCoordinates = true,
  readOnly = false,
}) => {
    return (
    <div className={className}>
        <div className="rounded-lg overflow-hidden border-2 border-gray-300">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height, width: '100%' }}
                scrollWheelZoom={true}>
                <TileLayer
                    url={MAP_DEFAULTS.tileLayerUrl}
                    attribution={MAP_DEFAULTS.attribution}/>
                <LocationPicker
                    position={selectedPosition}
                    onLocationSelect={onLocationSelect}
                    readOnly={readOnly}/>
            </MapContainer>
        </div>

        {showCoordinates && selectedPosition && (
            <p className="mt-2 text-sm text-gray-600">
                Selected coordinates: {selectedPosition[0].toFixed(6)}, {selectedPosition[1].toFixed(6)}
            </p>
        )}
    </div>
);
};