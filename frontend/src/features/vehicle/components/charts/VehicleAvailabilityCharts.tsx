import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { Clock, Wifi, WifiOff } from 'lucide-react';
import type {AvailabilitySummary} from "../../types/vehicle.types.ts";
import AvailabilityTooltip from "./AvailabilityTooltip.tsx";
import {formatMinutes, formatPercentage} from "../../../../utils/dataTransformers.ts";

interface AvailabilityChartsProps {
    data: AvailabilitySummary | null;
    loading: boolean;
}

const AvailabilityCharts: React.FC<AvailabilityChartsProps> = ({ data, loading }) => {
    const COLORS = {
        online: '#10b981',
        offline: '#ef4444',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data || !data.dataPoints || data.dataPoints.length === 0) {
        return (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
                <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No availability data available for this period</p>
            </div>
        );
    }

    const pieData = [
        { name: 'Online', value: data.totalOnlineMinutes, color: COLORS.online },
        { name: 'Offline', value: data.totalOfflineMinutes, color: COLORS.offline }
    ];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500 rounded-lg">
                            <Wifi className="text-white" size={20} />
                        </div>
                        <h3 className="font-semibold text-green-900">Online Time</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-700">{formatPercentage(data.onlinePercentage)}</p>
                    <p className="text-sm text-green-600 mt-1">{formatMinutes(data.totalOnlineMinutes)}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-500 rounded-lg">
                            <WifiOff className="text-white" size={20} />
                        </div>
                        <h3 className="font-semibold text-red-900">Offline Time</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-700">{formatPercentage(data.offlinePercentage)}</p>
                    <p className="text-sm text-red-600 mt-1">{formatMinutes(data.totalOfflineMinutes)}</p>
                </div>

                <div
                    className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-xl p-6 border border-blue-200 shadow-sm">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow">
                                <Clock className="text-white" size={20}/>
                            </div>
                            <h3 className="font-semibold text-blue-900 tracking-tight">
                                Total Time
                            </h3>
                        </div>

                        <p className="text-3xl font-bold text-blue-800 leading-tight">
                            {formatMinutes(
                                data.totalOnlineMinutes + data.totalOfflineMinutes
                            )}
                        </p>

                        <p className="text-sm text-blue-600 mt-1">
                            Online + Offline combined
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow border border-gray-200">
                    <h3 className="font-semibold mb-4">Availability Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.dataPoints}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                            <XAxis
                                dataKey="label"
                                tick={{fontSize: 12}}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                label={{value: 'Minutes', angle: -90, position: 'insideLeft'}}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip content={<AvailabilityTooltip />} />
                            <Legend />
                            <Bar dataKey="onlineMinutes" stackId="a" fill={COLORS.online} name="Online" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="offlineMinutes" stackId="a" fill={COLORS.offline} name="Offline" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - 1/3 width */}
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
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
                                labelLine={false}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => formatMinutes(value)}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Percentage Line Chart */}
            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
                <h3 className="font-semibold mb-4">Availability Percentage Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={data.dataPoints}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            domain={[0, 100]}
                            label={{ value: 'Online %', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value: number) => formatPercentage(value)}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="onlinePercentage"
                            stroke={COLORS.online}
                            fill={COLORS.online}
                            fillOpacity={0.3}
                            strokeWidth={2}
                            name="Online %"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AvailabilityCharts;