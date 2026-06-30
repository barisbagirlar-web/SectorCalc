/**
 * P6 — Human-readable (English default) explanation for a benchmark verdict.
 * UI surfaces localize position/severity labels separately; this string is a
 * deterministic fallback for API/tests/logging.
 */

import type {
  BenchmarkBand,
  BenchmarkPosition,
  BenchmarkSeverity,
} from "@/lib/regional-benchmarks/types";

const POSITION_PHRASE: Record<BenchmarkPosition, string> = {
  below_range: "below the indicative reference range",
  within_range: "within the indicative reference range",
  above_range: "above the indicative reference range",
  unknown: "outside any known reference range",
};

const SEVERITY_PHRASE: Record<BenchmarkSeverity, string> = {
  good: "This is a favorable position.",
  watch: "This is a typical position worth monitoring.",
  risk: "This position may indicate elevated risk.",
  unknown: "Position could not be assessed.",
};

export function explainBenchmarkVerdict(input: {
  readonly band: BenchmarkBand;
  readonly value: number;
  readonly position: BenchmarkPosition;
  readonly severity: BenchmarkSeverity;
}): string {
  const { band, value, position, severity } = input;
  const range = `${band.low}–${band.high} ${band.unit}`;
  return `A value of ${value} ${band.unit} is ${POSITION_PHRASE[position]} (${range}). ${SEVERITY_PHRASE[severity]}`;
}
