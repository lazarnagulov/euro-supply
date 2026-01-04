import apiClient from "../client";

export const productionService = {
  fetchProductionData: async ({
    factoryId,
    productId,
    productName,
    selectedPeriod,
    useCustomRange,
    customFrom,
    customTo,
  }: {
    factoryId: number;
    productId: number;
    productName?: string;
    selectedPeriod?: string;
    useCustomRange?: boolean;
    customFrom?: string;
    customTo?: string;
  }) => {
    if (!productName) return [];

    try {
      const params = new URLSearchParams();
      params.append("productId", productId.toString());

      if (useCustomRange && customFrom && customTo) {
        params.append("from", new Date(customFrom).toISOString());
        params.append("to", new Date(customTo).toISOString());
      } else if (selectedPeriod) {
        params.append("period", selectedPeriod);
      }

      const res = await apiClient.get(
        `/factories/${factoryId}/production?${params.toString()}`
      );

      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  },
};

export default productionService;
