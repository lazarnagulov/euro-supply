export type PeriodAggregation = "7d" | "30d" | "90d" | "180d" | "365d";

export interface TimeRangeParams {
  period?: string; // "7d", "30d", "90d", "180d", "365d"
  start?: string;  // ISO string for custom range
  end?: string;    // ISO string for custom range
}

export const PERIOD_TO_DAYS: Record<PeriodAggregation, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '365d': 365,
};