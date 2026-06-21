// Auto-generated from yuzey-gerilimi-hesaplama-schema.json
import * as z from 'zod';

export interface Yuzey_gerilimi_hesaplamaInput {
  kuvvet: number;
  uzunluk: number;
  dataConfidence?: number;
}

export const Yuzey_gerilimi_hesaplamaInputSchema = z.object({
  kuvvet: z.number().min(0).default(0.05),
  uzunluk: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yuzey_gerilimi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kuvvet / Math.max(0.0001, input.uzunluk); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYuzey_gerilimi_hesaplama(input: Yuzey_gerilimi_hesaplamaInput): Yuzey_gerilimi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "N/m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Yuzey_gerilimi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yuzey_gerilimi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N/m",
  breakdownKeys: ["sonuc"],
} as const;

