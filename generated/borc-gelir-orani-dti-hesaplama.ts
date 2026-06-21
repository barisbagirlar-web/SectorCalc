// Auto-generated from borc-gelir-orani-dti-hesaplama-schema.json
import * as z from 'zod';

export interface Borc_gelir_orani_dti_hesaplamaInput {
  aylikBorc: number;
  brutGelir: number;
  dataConfidence?: number;
}

export const Borc_gelir_orani_dti_hesaplamaInputSchema = z.object({
  aylikBorc: z.number().min(0).default(15000),
  brutGelir: z.number().min(0).default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Borc_gelir_orani_dti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.aylikBorc / Math.max(1, input.brutGelir)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBorc_gelir_orani_dti_hesaplama(input: Borc_gelir_orani_dti_hesaplamaInput): Borc_gelir_orani_dti_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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


export interface Borc_gelir_orani_dti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Borc_gelir_orani_dti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

