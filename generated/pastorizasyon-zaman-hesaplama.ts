// Auto-generated from pastorizasyon-zaman-hesaplama-schema.json
import * as z from 'zod';

export interface Pastorizasyon_zaman_hesaplamaInput {
  hacim: number;
  debi: number;
  dataConfidence?: number;
}

export const Pastorizasyon_zaman_hesaplamaInputSchema = z.object({
  hacim: z.number().min(0).default(5),
  debi: z.number().min(0).default(0.002),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pastorizasyon_zaman_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hacim / Math.max(0.0001, input.debi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePastorizasyon_zaman_hesaplama(input: Pastorizasyon_zaman_hesaplamaInput): Pastorizasyon_zaman_hesaplamaOutput {
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Pastorizasyon_zaman_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pastorizasyon_zaman_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: ["sonuc"],
} as const;

