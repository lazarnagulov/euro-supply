import apiClient from "../client";

export const productionService = {
  fetchProductionData: async ({
    factoryId,
    productId,
    selectedPeriod,
    useCustomRange,
    customFrom,
    customTo,
  }: {
    factoryId: number;
    productId: number;
    selectedPeriod?: string;
    useCustomRange?: boolean;
    customFrom?: string;
    customTo?: string;
  }) => {
    try {
      const params = new URLSearchParams();

      if (useCustomRange && customFrom && customTo) {
        params.append("start", new Date(customFrom).toISOString());
        params.append("end", new Date(customTo).toISOString());
      } else if (selectedPeriod) {
        const end = new Date();
        const start = new Date();

        switch (selectedPeriod) {
          case "7d":
            start.setDate(end.getDate() - 7);
            break;
          case "1m":
            start.setMonth(end.getMonth() - 1);
            break;
          case "3m":
            start.setMonth(end.getMonth() - 3);
            break;
          case "6m":
            start.setMonth(end.getMonth() - 6);
            break;
          case "1y":
            start.setFullYear(end.getFullYear() - 1);
            break;
          default:
            start.setDate(end.getDate() - 7);
        }

        params.append("start", start.toISOString());
        params.append("end", end.toISOString());
      } else {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        
        params.append("start", start.toISOString());
        params.append("end", end.toISOString());
      }

      const res = await apiClient.get(
        `/factories/${factoryId}/production/${productId}?${params.toString()}`
      );

      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  },
};

export default productionService;