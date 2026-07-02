/**
 * P6 - Regional Benchmark Engine types.
 *
 * Indicative decision-support bands only. These are NOT official statistics or
 * financial advice. Every band carries a sourceNote and a confidence level.
 */

export type BenchmarkRegion = "global" | "us" | "eu" | "tr" | "mena" | "latam";

export type BenchmarkMetric =
  | "gross_margin"
  | "net_margin"
  | "scrap_rate"
  | "labor_share"
  | "energy_intensity"
  | "material_share"
  | "capacity_utilization"
  | "quote_risk"
  | "payback_period";

export type BenchmarkUnit = "percent" | "ratio" | "days" | "months" | "score";

export type BenchmarkConfidence = "low" | "medium" | "high";

/** Whether a higher metric value is favorable, unfavorable, or neutral. */
export type BenchmarkDirection = "higher" | "lower" | "neutral";

export type BenchmarkBand = {
  readonly metric: BenchmarkMetric;
  readonly region: BenchmarkRegion;
  readonly industry?: string;
  readonly low: number;
  readonly mid: number;
  readonly high: number;
  readonly unit: BenchmarkUnit;
  readonly direction: BenchmarkDirection;
  readonly sourceNote: string;
  readonly confidence: BenchmarkConfidence;
};

export type BenchmarkPosition =
  | "below_range"
  | "within_range"
  | "above_range"
  | "unknown";

export type BenchmarkSeverity = "good" | "watch" | "risk" | "unknown";

export type BenchmarkVerdict = {
  readonly metric: BenchmarkMetric;
  readonly region: BenchmarkRegion;
  readonly value: number;
  readonly position: BenchmarkPosition;
  readonly severity: BenchmarkSeverity;
  readonly explanation: string;
  readonly sourceNote: string;
  readonly confidence: BenchmarkConfidence;
};
