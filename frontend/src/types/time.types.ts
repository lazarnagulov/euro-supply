export type PeriodAggregation = "1h" | "3h" | "12h" | "24h" | "7d" | "30d" | "90d" | "180d" | "365d";

export interface TimeRangeParams {
  period?: string; // "7d", "30d", "90d", "180d", "365d"
  start?: string;  // ISO string for custom range
  end?: string;    // ISO string for custom range
}

export const PERIOD_TO_DAYS: Record<PeriodAggregation, number> = {
  '1h': 1 / 24,
  '3h': 1 / 8,
  '12h': 1 / 2,
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '365d': 365,
};

export type PeriodMode = "availability" | "distance";

type PeriodOption = {
  label: string;
  value: PeriodAggregation;
  realtime?: boolean;
};

export const AVAILABILITY_PERIODS: PeriodOption[] = [
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 3 hours ", value: "3h", realtime: true },
  { label: "Last 12 hours", value: "12h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last month", value: "30d" },
  { label: "Last 3 months", value: "90d" },
  { label: "Last year", value: "365d" },
];

export const DISTANCE_PERIODS: PeriodOption[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last month", value: "30d" },
  { label: "Last 3 months", value: "90d" },
  { label: "Last 6 months", value: "180d" },
  { label: "Last year", value: "365d" },
];