export type PeriodAggregation = "7d" | "30d" | "90d" | "180d" | "365d";

export interface TimeRangeParams {
  period?: string; // "7d", "30d", "90d", "180d", "365d"
  start?: string;  // ISO string for custom range
  end?: string;    // ISO string for custom range
}
