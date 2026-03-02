import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Clock, Wifi, WifiOff } from "lucide-react";
import type { FactoryAvailabilitySummary } from "../../types/factory.types.ts";
import {
  formatMinutes,
  formatPercentage,
} from "../../../../utils/dataTransformers.ts";

interface FactoryAvailabilityChartsProps {
  data: FactoryAvailabilitySummary | null;
  loading: boolean;
}

const FactoryAvailabilityCharts: React.FC<FactoryAvailabilityChartsProps> = ({
  data,
  loading,
}) => {
  const COLORS = { online: "#10b981", offline: "#ef4444" };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !data.dataPoints || data.dataPoints.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <Clock size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">
          No availability data available for this period
        </p>
      </div>
    );
  }

  const pieData = [
    { name: "Online", value: data.totalOnlineMinutes, color: COLORS.online },
    { name: "Offline", value: data.totalOfflineMinutes, color: COLORS.offline },
  ];

  const barData = data.dataPoints.map((dp) => ({
    ...dp,
    status: dp.online ? 1 : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <Wifi className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-green-900">Online Time</h3>
          </div>
          <p className="text-3xl font-bold text-green-700">
            {formatPercentage(data.onlinePercentage)}
          </p>
          <p className="text-sm text-green-600 mt-1">
            <i>approx.</i> {formatMinutes(data.totalOnlineMinutes)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500 rounded-lg">
              <WifiOff className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-red-900">Offline Time</h3>
          </div>
          <p className="text-3xl font-bold text-red-700">
            {formatPercentage(data.offlinePercentage)}
          </p>
          <p className="text-sm text-red-600 mt-1">
            <i>approx.</i> {formatMinutes(data.totalOfflineMinutes)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <h3 className="font-semibold mb-4">Availability Per Window</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="timeLabel"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 1]}
                tickFormatter={(v) => (v === 1 ? "Online" : "Offline")}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => (value === 1 ? "Online" : "Offline")}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="status" name="Status" isAnimationActive={false}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.online ? COLORS.online : COLORS.offline}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-center">
            🟢 Online &nbsp; 🔴 Offline — per time window
          </p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <h3 className="font-semibold mb-4">Overall Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(1)}%`
                }
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  Number(value) === 1 ? "Online" : "Offline"
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FactoryAvailabilityCharts;
