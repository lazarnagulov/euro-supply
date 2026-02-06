import type { TimeRangeParams } from "../../types/time.types";
import apiClient from "../client";

export const productionService = {
  fetchProductionData: async ({
    factoryId,
    productId,
    timeRange,
  }: {
    factoryId: number;
    productId: number;
    timeRange: TimeRangeParams
  }) => {
      const params = new URLSearchParams();

      if (timeRange.start && timeRange.end) {
        params.append("start", timeRange.start);
        params.append("end", timeRange.end);
      } else if (timeRange.period) {
        params.append("period", timeRange.period);
      }

      const res = await apiClient.get(
        `/factories/${factoryId}/production/${productId}?${params.toString()}`
      );

      return res.data;
    
  },
};

export default productionService;