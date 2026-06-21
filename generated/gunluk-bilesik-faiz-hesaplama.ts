// Auto-generated from gunluk-bilesik-faiz-hesaplama-schema.json
import * as z from 'zod';

export interface Gunluk_bilesik_faiz_hesaplamaInput {
  anapara: number;
  faiz: number;
  gun: number;
  dataConfidence?: number;
}

export const Gunluk_bilesik_faiz_hesaplamaInputSchema = z.object({
  anapara: z.number().min(0).default(10000),
  faiz: z.number().min(0).default(10),
  gun: z.number().min(1).default(365),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gunluk_bilesik_faiz_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.anapara * Math.pow(1 + input.faiz / 36500, input.gun); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGunluk_bilesik_faiz_hesaplama(input: Gunluk_bilesik_faiz_hesaplamaInput): Gunluk_bilesik_faiz_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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


export interface Gunluk_bilesik_faiz_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gunluk_bilesik_faiz_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

