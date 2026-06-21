// Auto-generated from kumas-cekme-carpani-hesaplama-schema.json
import * as z from 'zod';

export interface Kumas_cekme_carpani_hesaplamaInput {
  hamOlcu: number;
  bitmisOlcu: number;
  dataConfidence?: number;
}

export const Kumas_cekme_carpani_hesaplamaInputSchema = z.object({
  hamOlcu: z.number().min(0).default(100),
  bitmisOlcu: z.number().min(0).default(96),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kumas_cekme_carpani_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.hamOlcu - input.bitmisOlcu) / Math.max(0.0001, input.hamOlcu)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKumas_cekme_carpani_hesaplama(input: Kumas_cekme_carpani_hesaplamaInput): Kumas_cekme_carpani_hesaplamaOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kumas_cekme_carpani_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kumas_cekme_carpani_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

