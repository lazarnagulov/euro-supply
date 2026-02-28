import { useEffect, useRef } from "react";
import { warehouseService } from "../../../api/services/warehouseService.ts";
import type { ConnectionStatus } from "../../../types/status.types.ts";

interface UseWarehousePollingOptions {
  warehouseId: string | undefined;
  onStatusUpdate: (status: ConnectionStatus) => void;
  enabled?: boolean;
  intervalMs?: number;
}

export const useWarehousePolling = ({
  warehouseId,
  onStatusUpdate,
  enabled = true,
  intervalMs = 10000,
}: UseWarehousePollingOptions) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || !warehouseId) return;

    const fetchStatus = async () => {
      try {
        const status = await warehouseService.getWarehouseStatus(
          Number(warehouseId)
        );
        onStatusUpdate(status);
      } catch (error) {
        console.error("Failed to fetch warehouse status:", error);
      }
    };

    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [warehouseId, enabled, intervalMs]);
};