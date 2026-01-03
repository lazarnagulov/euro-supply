import { useCallback } from "react";
import { usePolling } from "../../../hooks/common/usePolling";
import { factoryService } from "../../../api/services/factoryService";
import type { ConnectionStatus } from "../../../types/status.types";

interface UseFactoryPollingOptions {
  factoryId: string | undefined;
  onStatusUpdate: (status: ConnectionStatus) => void;
  statusInterval?: number;
  enabled?: boolean;
}

export function useFactoryPolling({
  factoryId,
  onStatusUpdate,
  statusInterval = 2 * 60 * 1000,
  enabled = true,
}: UseFactoryPollingOptions) {
  const { refresh: refreshStatus } = usePolling({
    fetchFn: useCallback(async () => {
      if (!factoryId) throw new Error("No factory ID");
      return await factoryService.getFactoryStatus(+factoryId);
    }, [factoryId]),
    onSuccess: onStatusUpdate,
    interval: statusInterval,
    enabled: enabled && !!factoryId,
    immediateFirstFetch: true,
  });

  return {
    refreshStatus,
  };
}
