import { useEffect, useState } from "react";
import type { FactoryAvailabilitySummary } from "../types/factory.types.ts";
import {
  PERIOD_TO_DAYS,
  type PeriodAggregation,
} from "../../../types/time.types.ts";
import { factoryService } from "../../../api/services/factoryService.ts";
import toast from "react-hot-toast";

export const useFactoryAvailabilityData = (
  factoryId: string | undefined,
  initialPeriod: PeriodAggregation = "12h",
) => {
  const [availabilityData, setAvailabilityData] =
    useState<FactoryAvailabilitySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!factoryId) return;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        const end = new Date().toISOString();
        const days = PERIOD_TO_DAYS[initialPeriod];
        const start = new Date(
          Date.now() - days * 24 * 60 * 60 * 1000,
        ).toISOString();
        const data = await factoryService.getAvailability(+factoryId, {
          start,
          end,
        });
        setAvailabilityData(data);
      } catch (err) {
        console.error("Failed to load factory availability:", err);
        toast.error("Failed to load availability data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [factoryId, initialPeriod]);

  const loadPeriod = async (period: PeriodAggregation) => {
    if (!factoryId) return;
    setLoading(true);
    setError(null);
    try {
      const days = PERIOD_TO_DAYS[period];
      const end = new Date();
      const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
      const data = await factoryService.getAvailability(+factoryId, {
        start: start.toISOString(),
        end: end.toISOString(),
      });
      setAvailabilityData(data);
    } catch (err: any) {
      console.error("Error loading factory availability:", err);
      setError(err?.message || "Failed to load availability data");
      setAvailabilityData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomRange = async (from: Date, to: Date) => {
    if (!factoryId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await factoryService.getAvailability(+factoryId, {
        start: from.toISOString(),
        end: to.toISOString(),
      });
      setAvailabilityData(data);
    } catch (err: any) {
      console.error("Error loading factory availability:", err);
      setError(
        err.response?.data?.message || "Failed to load availability data",
      );
      setAvailabilityData(null);
    } finally {
      setLoading(false);
    }
  };

  return { availabilityData, loading, error, loadPeriod, loadCustomRange };
};
