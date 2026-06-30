import type { GeneratedToolResult } from "@/lib/generated-tools/types";

export function resolveQuoteBaseTotal(
  result: GeneratedToolResult,
  primaryOutputKey: string,
): number {
  const primary = result[primaryOutputKey];
  if (typeof primary === "number" && Number.isFinite(primary)) {
    return primary;
  }

  const wasteTotal = result.totalWasteCost;
  if (typeof wasteTotal === "number" && Number.isFinite(wasteTotal)) {
    return wasteTotal;
  }

  if (typeof result.dataConfidenceAdjusted === "number" && Number.isFinite(result.dataConfidenceAdjusted)) {
    return result.dataConfidenceAdjusted;
  }

  return 0;
}

export function applyFireRateToQuoteTotal(baseTotal: number, fireRatePercent: number): number {
  if (!Number.isFinite(baseTotal) || baseTotal <= 0) {
    return 0;
  }
  const rate = Number.isFinite(fireRatePercent) ? Math.max(0, fireRatePercent) : 0;
  return baseTotal * (1 + rate / 100);
}
