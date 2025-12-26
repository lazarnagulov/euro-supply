import type { DistancePoint } from "../features/vehicle/types/vehicle.types";

export const transformDistanceData = (rawData: any[]): DistancePoint[] => {
    return rawData.map((item) => ({
        time: new Date(item.time).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        distance: item.distanceTraveled
    }));
};