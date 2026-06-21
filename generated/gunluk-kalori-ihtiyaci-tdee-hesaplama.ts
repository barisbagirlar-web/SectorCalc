// Auto-generated from gunluk-kalori-ihtiyaci-tdee-hesaplama-schema.json
import * as z from 'zod';

export interface Gunluk_kalori_ihtiyaci_tdee_hesaplamaInput {
  bmr: number;
  aktiviteSeviyesi: number;
  dataConfidence?: number;
}

export const Gunluk_kalori_ihtiyaci_tdee_hesaplamaInputSchema = z.object({
  bmr: z.number().min(0).default(1650),
  aktiviteSeviyesi: z.number().min(1.2).max(2).default(1.55),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gunluk_kalori_ihtiyaci_tdee_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bmr * input.aktiviteSeviyesi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGunluk_kalori_ihtiyaci_tdee_hesaplama(input: Gunluk_kalori_ihtiyaci_tdee_hesaplamaInput): Gunluk_kalori_ihtiyaci_tdee_hesaplamaOutput {
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


export interface Gunluk_kalori_ihtiyaci_tdee_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gunluk_kalori_ihtiyaci_tdee_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kcal",
  breakdownKeys: ["sonuc"],
} as const;

