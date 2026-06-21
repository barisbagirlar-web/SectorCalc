// Auto-generated from lazer-isleme-parametreleri-hesaplama-schema.json
import * as z from 'zod';

export interface Lazer_isleme_parametreleri_hesaplamaInput {
  lazerGuc: number;
  kesmeHiz: number;
  malzemeKalinlik: number;
  dataConfidence?: number;
}

export const Lazer_isleme_parametreleri_hesaplamaInputSchema = z.object({
  lazerGuc: z.number().min(0).default(4000),
  kesmeHiz: z.number().min(0).default(0.05),
  malzemeKalinlik: z.number().min(0).default(0.01),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lazer_isleme_parametreleri_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lazerGuc / Math.max(0.0001, (input.kesmeHiz * input.malzemeKalinlik)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateLazer_isleme_parametreleri_hesaplama(input: Lazer_isleme_parametreleri_hesaplamaInput): Lazer_isleme_parametreleri_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "J/m2",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Lazer_isleme_parametreleri_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lazer_isleme_parametreleri_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "J/m2",
  breakdownKeys: ["sonuc"],
} as const;

