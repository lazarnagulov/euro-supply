import { useCallback } from 'react';
import {usePolling} from "../../../hooks/common/usePolling.tsx";
import {vehicleService} from "../../../api/services/vehicleService.ts";
import type {ConnectionStatus} from "../../../types/status.types.ts";

interface UseVehiclePollingOptions {
    vehicleId: string | undefined;
    onLocationUpdate: (location: any) => void;
    onStatusUpdate: (status: ConnectionStatus) => void;
    locationInterval?: number;
    statusInterval?: number;
    enabled?: boolean;
}

export function useVehiclePolling({
    vehicleId,
    onLocationUpdate,
    onStatusUpdate,
    locationInterval = 5 * 60 * 1000,
    statusInterval = 2 * 60 * 1000,
    enabled = true,
}: UseVehiclePollingOptions) {

    const { refresh: refreshLocation } = usePolling({
        fetchFn: useCallback(async () => {
            if (!vehicleId) throw new Error('No vehicle ID');
            return await vehicleService.getVehicleLocation(+vehicleId);
        }, [vehicleId]),
        onSuccess: onLocationUpdate,
        interval: locationInterval,
        enabled: enabled && !!vehicleId,
        immediateFirstFetch: false
    });

    const { refresh: refreshStatus } = usePolling({
        fetchFn: useCallback(async () => {
            if (!vehicleId) throw new Error('No vehicle ID');
            return await vehicleService.getVehicleStatus(+vehicleId);
        }, [vehicleId]),
        onSuccess: onStatusUpdate,
        interval: statusInterval,
        enabled: enabled && !!vehicleId,
        immediateFirstFetch: false
    });

    return {
        refreshLocation,
        refreshStatus,
        refreshAll: useCallback(() => {
            refreshLocation();
            refreshStatus();
        }, [refreshLocation, refreshStatus]),
    };
}