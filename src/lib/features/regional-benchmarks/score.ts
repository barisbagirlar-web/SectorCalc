/**
 * P6 - Benchmark scoring: position a value within an indicative band and derive
 * a decision-support verdict. Pure, deterministic, display-only.
 */

import type {
  BenchmarkMetric,
  BenchmarkPosition,
  BenchmarkRegion,
  BenchmarkSeverity,
  BenchmarkVerdict,
} from "@/lib/features/regional-benchmarks/types";
import { getBenchmarkBand } from "@/lib/features/regional-benchmarks/benchmark-registry";
import { explainBenchmarkVerdict } from "@/lib/features/regional-benchmarks/explain";

export { getBenchmarkBand };

function resolvePosition(value: number, low: number, high: number): BenchmarkPosition {
  if (!Number.isFinite(value)) {
    return "unknown";
  }
  if (value < low) {
    return "below_range";
  }
  if (value > high) {
    return "above_range";
  }
  return "within_range";
}

function resolveSeverity(
  position: BenchmarkPosition,
  direction: "higher" | "lower" | "neutral",
): BenchmarkSeverity {
  if (position === "unknown") {
    return "unknown";
  }
  if (position === "within_range") {
    return "watch";
  }
  if (direction === "neutral") {
    return "watch";
  }
  if (direction === "higher") {
    return position === "above_range" ? "good" : "risk";
  }
  // direction === "lower"
  return position === "below_range" ? "good" : "risk";
}

export function scoreAgainstBenchmark(input: {
  readonly metric: BenchmarkMetric;
  readonly region: BenchmarkRegion;
  readonly value: number;
  readonly industry?: string;
}): BenchmarkVerdict {
  const band = getBenchmarkBand({
    metric: input.metric,
    region: input.region,
    industry: input.industry,
  });

  if (!band) {
    return {
      metric: input.metric,
      region: input.region,
      value: input.value,
      position: "unknown",
      severity: "unknown",
      explanation: "No benchmark band is available for this metric and region.",
      sourceNote: "No source",
      confidence: "low",
    };
  }

  const position = resolvePosition(input.value, band.low, band.high);
  const severity = resolveSeverity(position, band.direction);
  const explanation = explainBenchmarkVerdict({ band, value: input.value, position, severity });

  return {
    metric: input.metric,
    region: input.region,
    value: input.value,
    position,
    severity,
    explanation,
    sourceNote: band.sourceNote,
    confidence: band.confidence,
  };
}
