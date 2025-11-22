import L from 'leaflet';

export interface MapConfig {
    center: [number, number];
    zoom: number;
    height: string;
    tileLayerUrl: string;
    attribution: string;
}

export const MAP_DEFAULTS: MapConfig = {
    center: [
        parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT) || 44.8176,
        parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG) || 20.4569,
    ],
    zoom: 13,
    height: '400px',
    tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

export const fixLeafletIcons = (): void => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};