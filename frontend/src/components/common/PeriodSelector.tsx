import React from "react";
import type {DistanceAggregation} from "../../features/vehicle/types/vehicle.types.ts";

const PREDEFINED_PERIODS: { label: string; value: DistanceAggregation }[] = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last month", value: "30d" },
    { label: "Last 3 months", value: "90d" },
    { label: "Last 6 months", value: "180d" },
    { label: "Last year", value: "365d" },
];

interface PeriodSelectorProps {
    selectedPeriod: DistanceAggregation | null;
    onSelectPeriod: (p: DistanceAggregation) => void;

    // Custom range
    useCustomRange: boolean;
    onToggleCustomRange: () => void;

    customFrom: string;
    customTo: string;
    onCustomFromChange: (v: string) => void;
    onCustomToChange: (v: string) => void;
    onApplyCustomRange: () => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
    selectedPeriod,
    onSelectPeriod,

    useCustomRange,
    onToggleCustomRange,

    customFrom,
    customTo,
    onCustomFromChange,
    onCustomToChange,
    onApplyCustomRange
}) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                {PREDEFINED_PERIODS.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => onSelectPeriod(p.value)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${
                            selectedPeriod === p.value
                                ? "bg-blue-600 text-white border-2 border-blue-700"
                                : "bg-gray-100 text-black hover:bg-gray-200"
                        }`}
                    >
                        {p.label}
                    </button>
                ))}

                <button
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${
                        useCustomRange
                            ? "bg-blue-600 text-white border-2 border-blue-700"
                            : "bg-gray-100 text-black hover:bg-gray-200"
                    }`}
                    onClick={onToggleCustomRange}
                >
                    Custom range
                </button>
            </div>

            {useCustomRange && (
                <div className="flex items-end gap-4 mt-2">
                    <div className="flex flex-col">
                        <label className="text-sm">From</label>
                        <input
                            type="date"
                            className="border rounded-xl px-3 py-2"
                            value={customFrom}
                            onChange={(e) => onCustomFromChange(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm">To</label>
                        <input
                            type="date"
                            className="border rounded-xl px-3 py-2"
                            value={customTo}
                            onChange={(e) => onCustomToChange(e.target.value)}
                        />
                    </div>

                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                        onClick={onApplyCustomRange}
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
};
