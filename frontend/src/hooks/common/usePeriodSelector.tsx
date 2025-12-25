import { useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import type {PeriodAggregation} from "../../types/time.types.ts";

interface DateRange {
    from: Date;
    to: Date;
    diffDays: number;
}

interface UsePeriodSelectorReturn {
    selectedPeriod: PeriodAggregation | null;
    setSelectedPeriod: (period: PeriodAggregation | null) => void;
    useCustomRange: boolean;
    toggleCustomRange: () => void;
    customFrom: string;
    customTo: string;
    setCustomFrom: (date: string) => void;
    setCustomTo: (date: string) => void;
    validateDateRange: () => DateRange | null;
}

export function usePeriodSelector(
    initialPeriod: PeriodAggregation = "7d"
): UsePeriodSelectorReturn {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodAggregation | null>(initialPeriod);
    const [useCustomRange, setUseCustomRange] = useState(false);
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");

    const toggleCustomRange = () => {
        setUseCustomRange(!useCustomRange);
        setSelectedPeriod(null);
    };

    const validateDateRange = (): DateRange | null => {
        if (!customFrom || !customTo) {
            toast.error("Please select both start and end dates");
            return null;
        }

        const from = new Date(customFrom);
        const to = new Date(customTo);
        const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays > 365) {
            toast.error("Date range cannot exceed 365 days", {
                duration: 5000,
                icon: <AlertTriangle size={24} color="red" />,
            });
            return null;
        }

        if (diffDays < 0) {
            toast.error("End date must be after start date");
            return null;
        }

        return { from, to, diffDays };
    };

    return {
        selectedPeriod,
        setSelectedPeriod,
        useCustomRange,
        toggleCustomRange,
        customFrom,
        customTo,
        setCustomFrom,
        setCustomTo,
        validateDateRange,
    };
}