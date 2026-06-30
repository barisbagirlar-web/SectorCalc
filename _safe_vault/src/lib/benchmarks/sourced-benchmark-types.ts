/**
 * Sourced sector benchmark data types — no fabricated averages.
 * Separate from beta-partner benchmark loop types in benchmark-types.ts.
 */

export type SourcedBenchmarkSourceType =
  | "official_statistics"
  | "chamber_report"
  | "academic_paper"
  | "internal_anonymized_aggregate"
  | "user_verified_dataset";

export type SourcedBenchmarkConfidence = "verified" | "estimated" | "indicative";

export type SourcedBenchmarkValueRange = {
  readonly min: number;
  readonly max: number;
};

export type SourcedBenchmarkEntry = {
  readonly id: string;
  readonly sector: string;
  readonly country: string;
  readonly metric: string;
  readonly valueRange: SourcedBenchmarkValueRange;
  readonly unit: string;
  readonly sourceName: string;
  readonly sourceUrl?: string;
  readonly sourceType: SourcedBenchmarkSourceType;
  readonly year: number;
  readonly confidence: SourcedBenchmarkConfidence;
  readonly lastReviewedAt: string;
  readonly disclaimer: string;
};

export const SOURCED_BENCHMARK_UNAVAILABLE_MESSAGE =
  "Sector benchmark is not available for this region yet.";

export const SOURCED_BENCHMARK_DISCLAIMER =
  "Benchmarks appear only when a documented source is registered. SectorCalc does not invent industry averages.";
