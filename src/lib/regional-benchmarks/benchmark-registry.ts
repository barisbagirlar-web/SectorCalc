/**
 * P6 — Indicative regional benchmark bands.
 *
 * IMPORTANT: These are low-confidence, indicative reference ranges intended for
 * decision support only. They are not official industry statistics and must not
 * be presented as verified facts or financial advice. Each entry documents a
 * sourceNote and confidence level.
 */

import type { BenchmarkBand, BenchmarkMetric, BenchmarkRegion } from "@/lib/regional-benchmarks/types";

const INDICATIVE_NOTE =
  "Indicative reference range aggregated from public ranges and operator heuristics. Not official statistics.";

/**
 * Global baseline bands. Regional overrides are layered on top where provided.
 * Values are deliberately conservative wide ranges.
 */
const GLOBAL_BANDS: Record<BenchmarkMetric, Omit<BenchmarkBand, "region">> = {
  gross_margin: { metric: "gross_margin", low: 20, mid: 35, high: 50, unit: "percent", direction: "higher", sourceNote: INDICATIVE_NOTE, confidence: "low" },
  net_margin: { metric: "net_margin", low: 4, mid: 9, high: 15, unit: "percent", direction: "higher", sourceNote: INDICATIVE_NOTE, confidence: "low" },
  scrap_rate: { metric: "scrap_rate", low: 1, mid: 4, high: 8, unit: "percent", direction: "lower", sourceNote: INDICATIVE_NOTE, confidence: "low" },
  labor_share: { metric: "labor_share", low: 18, mid: 28, high: 40, unit: "percent", direction: "neutral", sourceNote: INDICATIVE_NOTE, confidence: "low" },
  energy_intensity: { metric: "energy_intensity", low: 2, mid: 6, high: 12, unit: "percent", direction: "lower", sourceNote: INDICATIVE_NOTE, confidence: "low" },
  material_share: { metric: "material_share", low: 30, mid: 45, high: 60, unit: "percent", direction: "neutral", sourceNote: INDICATIVE_NOTE, confidence: "low" },
  capacity_utilization: { metric: "capacity_utilization", low: 55, mid: 75, high: 90, unit: "percent", direction: "higher", sourceNote: INDICATIVE_NOTE, confidence: "low" },
  quote_risk: { metric: "quote_risk", low: 20, mid: 50, high: 75, unit: "score", direction: "lower", sourceNote: INDICATIVE_NOTE, confidence: "low" },
  payback_period: { metric: "payback_period", low: 6, mid: 18, high: 36, unit: "months", direction: "lower", sourceNote: INDICATIVE_NOTE, confidence: "low" },
};

/** Sparse regional overrides — only where a meaningful regional skew is assumed. */
const REGIONAL_OVERRIDES: Partial<Record<BenchmarkRegion, Partial<Record<BenchmarkMetric, Partial<Omit<BenchmarkBand, "region" | "metric">>>>>> = {
  tr: {
    energy_intensity: { low: 3, mid: 8, high: 16 },
    gross_margin: { low: 18, mid: 30, high: 45 },
  },
  eu: {
    energy_intensity: { low: 2, mid: 7, high: 14 },
  },
};

export function getBenchmarkBand(input: {
  readonly metric: BenchmarkMetric;
  readonly region: BenchmarkRegion;
  readonly industry?: string;
}): BenchmarkBand | null {
  const base = GLOBAL_BANDS[input.metric];
  if (!base) {
    return null;
  }
  const override = REGIONAL_OVERRIDES[input.region]?.[input.metric];
  return {
    ...base,
    ...override,
    region: input.region,
    industry: input.industry,
  };
}

export const BENCHMARK_DISCLAIMER =
  "Benchmarks are indicative decision-support ranges, not official statistics or financial advice. Verify against your own data before any business decision.";

const LOCALE_BENCHMARK_REGION: Readonly<Record<string, BenchmarkRegion>> = {
  en: "global",
  tr: "tr",
  de: "eu",
  fr: "eu",
  es: "eu",
  ar: "mena",
};

export function resolveBenchmarkRegionForLocale(locale: string): BenchmarkRegion {
  return LOCALE_BENCHMARK_REGION[locale.toLowerCase().split("-")[0]] ?? "global";
}
