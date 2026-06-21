// Auto-generated from tiklanma-orani-ctr-hesaplama-schema.json
import * as z from 'zod';

export interface Tiklanma_orani_ctr_hesaplamaInput {
  tiklama: number;
  gosterim: number;
  dataConfidence?: number;
}

export const Tiklanma_orani_ctr_hesaplamaInputSchema = z.object({
  tiklama: z.number().min(0).default(500),
  gosterim: z.number().min(1).default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tiklanma_orani_ctr_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tiklama / Math.max(1, input.gosterim)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTiklanma_orani_ctr_hesaplama(input: Tiklanma_orani_ctr_hesaplamaInput): Tiklanma_orani_ctr_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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


export interface Tiklanma_orani_ctr_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tiklanma_orani_ctr_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

