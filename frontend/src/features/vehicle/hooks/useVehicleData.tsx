import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../../../api/services/vehicleService';
import type {VehicleResponse} from "../types/vehicle.types.ts";
import type {ConnectionStatus} from "../../../types/status.types.ts";

export function useVehicleData(vehicleId: string | undefined) {
    const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchVehicle = useCallback(async () => {
        if (!vehicleId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await vehicleService.getVehicle(+vehicleId);
            setVehicle(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setVehicle(null);
        } finally {
            setLoading(false);
        }
    }, [vehicleId]);

    const updateLocation = useCallback((location: any) => {
        console.log('Updating location:', location);
        setVehicle((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                lastLocation: location,
            };
        });
    }, []);

    const updateStatus = useCallback((status: ConnectionStatus) => {
        console.log('Updating status:', status);
        setVehicle((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                online: status.online,
            };
        });
    }, []);

    useEffect(() => {
        fetchVehicle();
    }, [fetchVehicle]);

    return {
        vehicle,
        loading,
        error,
        updateLocation,
        updateStatus,
        refetch: fetchVehicle
    };
}