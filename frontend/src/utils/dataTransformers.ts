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


export const formatMinutes = (minutes: number) => {
    const minsInHour = 60;
    const minsInDay = 60 * 24;
    const minsInYear = minsInDay * 365;

    const years = Math.floor(minutes / minsInYear);
    minutes %= minsInYear;

    const days = Math.floor(minutes / minsInDay);
    minutes %= minsInDay;

    const hours = Math.floor(minutes / minsInHour);
    const mins = Math.floor(minutes % minsInHour);

    const parts: string[] = [];

    if (years) parts.push(`${years}y`);
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (mins || parts.length === 0) parts.push(`${mins}m`);

    return parts.join(" ");
};


export const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
