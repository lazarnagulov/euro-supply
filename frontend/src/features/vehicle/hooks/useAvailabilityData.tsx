import { useState } from 'react';
import type {AvailabilitySummary} from "../types/vehicle.types.ts";
import {PERIOD_TO_DAYS, type PeriodAggregation} from "../../../types/time.types.ts";
import {vehicleService} from "../../../api/services/vehicleService.ts";

export const useAvailabilityData = (vehicleId: string | undefined) => {
    const [availabilityData, setAvailabilityData] = useState<AvailabilitySummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadPeriod = async (period: PeriodAggregation) => {
        if (!vehicleId) return;

        setLoading(true);
        setError(null);

        try {
            const days = PERIOD_TO_DAYS[period];
            const end = new Date();
            const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

            const response = await vehicleService.getAvailability(
                +vehicleId,
                {
                    start: start.toISOString(),
                    end: end.toISOString(),
                }
            );

            setAvailabilityData(response);
        } catch (err: any) {
            console.error('Error loading availability data:', err);
            setError(err?.message || 'Failed to load availability data');
            setAvailabilityData(null);
        } finally {
            setLoading(false);
        }
    };

    const loadCustomRange = async (from: Date, to: Date) => {
        if (!vehicleId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await vehicleService.getAvailability(
                +vehicleId,
                {
                    start: from.toISOString(),
                    end: to.toISOString(),
                }
            );
            setAvailabilityData(response);
        } catch (err: any) {
            console.error('Error loading availability data:', err);
            setError(err.response?.data?.message || 'Failed to load availability data');
            setAvailabilityData(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        availabilityData,
        loading,
        error,
        loadPeriod,
        loadCustomRange,
    };
};