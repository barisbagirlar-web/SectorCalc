// Auto-generated from bazal-metabolizma-bmr-hesaplama-schema.json
import * as z from 'zod';

export interface Bazal_metabolizma_bmr_hesaplamaInput {
  agirlik: number;
  boy: number;
  yas: number;
  cinsiyet: number;
  dataConfidence?: number;
}

export const Bazal_metabolizma_bmr_hesaplamaInputSchema = z.object({
  agirlik: z.number().min(0).default(75),
  boy: z.number().min(0).default(175),
  yas: z.number().min(10).max(100).default(30),
  cinsiyet: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bazal_metabolizma_bmr_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cinsiyet === 1 ? (10 * input.agirlik + 6.25 * input.boy - 5 * input.yas + 5) : (10 * input.agirlik + 6.25 * input.boy - 5 * input.yas - 161); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBazal_metabolizma_bmr_hesaplama(input: Bazal_metabolizma_bmr_hesaplamaInput): Bazal_metabolizma_bmr_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult a healthcare professional before starting any diet or exercise program.","Individual results may vary."];
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
    unit: "kcal",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Bazal_metabolizma_bmr_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bazal_metabolizma_bmr_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kcal",
  breakdownKeys: ["sonuc"],
} as const;

