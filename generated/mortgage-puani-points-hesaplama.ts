// Auto-generated from mortgage-puani-points-hesaplama-schema.json
import * as z from 'zod';

export interface Mortgage_puani_points_hesaplamaInput {
  kredi: number;
  puanOrani: number;
  aylikTasarruf: number;
  dataConfidence?: number;
}

export const Mortgage_puani_points_hesaplamaInputSchema = z.object({
  kredi: z.number().min(0).default(1000000),
  puanOrani: z.number().min(0).default(2),
  aylikTasarruf: z.number().min(0).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mortgage_puani_points_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kredi * input.puanOrani / 100; results["maliyet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maliyet"] = Number.NaN; }
  try { const v = (input.kredi * input.puanOrani / 100) / Math.max(1, input.aylikTasarruf); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMortgage_puani_points_hesaplama(input: Mortgage_puani_points_hesaplamaInput): Mortgage_puani_points_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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
    unit: "months",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Mortgage_puani_points_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mortgage_puani_points_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "months",
  breakdownKeys: ["sonuc"],
} as const;

