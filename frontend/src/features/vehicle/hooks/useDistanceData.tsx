import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import type { DistancePoint } from "../types/vehicle.types";
import { vehicleService } from "../../../api/services/vehicleService";
import { calculateStartDate } from "../../../utils/dateUtils";
import { transformDistanceData } from "../../../utils/dataTransformers";
import type {PeriodAggregation} from "../../../types/time.types.ts";

interface UseDistanceDataReturn {
    distanceData: DistancePoint[];
    loading: boolean;
    loadPeriod: (period: PeriodAggregation) => Promise<void>;
    loadCustomRange: (from: Date, to: Date, diffDays: number) => Promise<void>;
}

export function useDistanceData(
    vehicleId: string | undefined,
    initialPeriod: PeriodAggregation = "7d"
): UseDistanceDataReturn {
    const [distanceData, setDistanceData] = useState<DistancePoint[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!vehicleId) return;

        const loadInitialData = async () => {
            try {
                setLoading(true);
                const start = calculateStartDate(initialPeriod);
                const end = new Date().toISOString();
                const distances = await vehicleService.getDistances(+vehicleId, { start, end });
                setDistanceData(transformDistanceData(distances));
            } catch (err) {
                console.error("Failed to load initial distance data:", err);
                toast.error("Failed to load distance data");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [vehicleId, initialPeriod]);

    const loadPeriod = useCallback(async (period: PeriodAggregation) => {
        if (!vehicleId) return;

        try {
            setLoading(true);
            const start = calculateStartDate(period);
            const end = new Date().toISOString();
            const distances = await vehicleService.getDistances(+vehicleId, { start, end });
            setDistanceData(transformDistanceData(distances));
            toast.success("Distance data updated successfully");
        } catch (err) {
            console.error("Failed to load distance data:", err);
            toast.error("Failed to load distance data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [vehicleId]);

    const loadCustomRange = useCallback(async (from: Date, to: Date, diffDays: number) => {
        if (!vehicleId) return;

        try {
            setLoading(true);
            const distances = await vehicleService.getDistances(+vehicleId, {
                start: from.toISOString(),
                end: to.toISOString(),
            });
            setDistanceData(transformDistanceData(distances));
            toast.success(`Loaded data for ${Math.round(diffDays)} days`);
        } catch (err) {
            console.error("Failed to load custom range data:", err);
            toast.error("Failed to load custom range data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [vehicleId]);

    return {
        distanceData,
        loading,
        loadPeriod,
        loadCustomRange,
    };
}