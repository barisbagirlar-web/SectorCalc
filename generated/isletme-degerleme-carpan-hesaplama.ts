// Auto-generated from isletme-degerleme-carpan-hesaplama-schema.json
import * as z from 'zod';

export interface Isletme_degerleme_carpan_hesaplamaInput {
  favok: number;
  carpan: number;
  dataConfidence?: number;
}

export const Isletme_degerleme_carpan_hesaplamaInputSchema = z.object({
  favok: z.number().min(0).default(500000),
  carpan: z.number().min(1).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Isletme_degerleme_carpan_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.favok * input.carpan; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateIsletme_degerleme_carpan_hesaplama(input: Isletme_degerleme_carpan_hesaplamaInput): Isletme_degerleme_carpan_hesaplamaOutput {
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Isletme_degerleme_carpan_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Isletme_degerleme_carpan_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

