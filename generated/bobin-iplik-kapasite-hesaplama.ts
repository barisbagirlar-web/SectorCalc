// Auto-generated from bobin-iplik-kapasite-hesaplama-schema.json
import * as z from 'zod';

export interface Bobin_iplik_kapasite_hesaplamaInput {
  bobinAgirlik: number;
  iplikNumara: number;
  dataConfidence?: number;
}

export const Bobin_iplik_kapasite_hesaplamaInputSchema = z.object({
  bobinAgirlik: z.number().min(0).default(100),
  iplikNumara: z.number().min(0).default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bobin_iplik_kapasite_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bobinAgirlik / 1000) * input.iplikNumara * 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBobin_iplik_kapasite_hesaplama(input: Bobin_iplik_kapasite_hesaplamaInput): Bobin_iplik_kapasite_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Bobin_iplik_kapasite_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bobin_iplik_kapasite_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

