import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Calendar, X } from "lucide-react";
import { PeriodSelector } from "../../../components/common/PeriodSelector.tsx";
import type { PeriodAggregation } from "../../../types/time.types.ts";
import productionService from "../../../api/services/productionService.ts";
import type { ApiError } from "../../../types/api.types.ts";
import { validateCustomRange } from "../../../utils/timeRangeValidator";

interface ProductStatsModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
  productId: number;
  factoryId: number;
}

export const ProductStatsModal: React.FC<ProductStatsModalProps> = ({
  open,
  onClose,
  productName,
  productId,
  factoryId,
}) => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodAggregation | null>("7d");
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [productionData, setProductionData] = useState<
    { time: string; quantity: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSelectPeriod = (period: PeriodAggregation) => {
    setSelectedPeriod(period);
    setUseCustomRange(false);
    setCustomFrom("");
    setCustomTo("");
  };

  const handleToggleCustomRange = () => {
    setUseCustomRange(true);
    setSelectedPeriod(null);
  };

  const fetchProductionData = async () => {
    setError(undefined);
    if (!productName) return;
    setLoading(true);

    try {
      const { valid, error } = validateCustomRange(customFrom, customTo);

      if (!valid) {
        setError(error);
        setLoading(false);
        return;
      }

      const data = await productionService.fetchProductionData({
        factoryId,
        productId,
        timeRange: {
          period: selectedPeriod || undefined,
          start:
            useCustomRange && customFrom
              ? new Date(customFrom).toISOString()
              : undefined,
          end:
            useCustomRange && customTo
              ? new Date(customTo).toISOString()
              : undefined,
        },
      });

      // Format the time to be more readable (date and hour)
      const formattedData = data.map((item: any) => ({
        ...item,
        time: new Date(item.time).toLocaleString("sr-RS", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setProductionData(formattedData);
    } catch (err: ApiError | any) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchProductionData();
  }, [open, selectedPeriod, useCustomRange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={18} /> Production Statistics:{" "}
            {productName || "Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onSelectPeriod={handleSelectPeriod}
            useCustomRange={useCustomRange}
            onToggleCustomRange={handleToggleCustomRange}
            customFrom={customFrom}
            customTo={customTo}
            onCustomFromChange={setCustomFrom}
            onCustomToChange={setCustomTo}
            onApplyCustomRange={fetchProductionData}
          />

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="relative">
            <h3 className="font-semibold mb-4">Production Chart</h3>
            <div className="w-full h-96">
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <ResponsiveContainer>
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 13 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="quantity"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
