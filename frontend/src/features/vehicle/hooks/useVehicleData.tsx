import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { VehicleResponse } from "../types/vehicle.types";
import { vehicleService } from "../../../api/services/vehicleService";

interface UseVehicleDataReturn {
    vehicle: VehicleResponse | null;
    loading: boolean;
    error: string | null;
}

export function useVehicleData(vehicleId: string | undefined): UseVehicleDataReturn {
    const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!vehicleId) {
            setLoading(false);
            return;
        }

        const loadVehicle = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await vehicleService.getVehicle(+vehicleId);
                setVehicle(data);
            } catch (err) {
                const errorMessage = "Failed to load vehicle details";
                setError(errorMessage);
                toast.error(errorMessage);
                console.error("Failed to load vehicle:", err);
            } finally {
                setLoading(false);
            }
        };

        loadVehicle();
    }, [vehicleId]);

    return { vehicle, loading, error };
}