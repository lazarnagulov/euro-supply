import React from "react";

interface AvailabilityTooltipProps {
    active?: boolean;
    payload?: any[];
}

const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
};

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

const AvailabilityTooltip: React.FC<AvailabilityTooltipProps> = ({
    active,
    payload
}) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <p className="font-semibold mb-2">{data.label}</p>

            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">
                        Online: {formatMinutes(data.onlineMinutes)} (
                        {formatPercentage(data.onlinePercentage)})
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">
                        Offline: {formatMinutes(data.offlineMinutes)} (
                        {formatPercentage(100 - data.onlinePercentage)})
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityTooltip;
