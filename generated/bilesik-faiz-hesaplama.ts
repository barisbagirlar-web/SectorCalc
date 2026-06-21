// Auto-generated from bilesik-faiz-hesaplama-schema.json
import * as z from 'zod';

export interface Bilesik_faiz_hesaplamaInput {
  anapara: number;
  faiz: number;
  yil: number;
  siklik: number;
  dataConfidence?: number;
}

export const Bilesik_faiz_hesaplamaInputSchema = z.object({
  anapara: z.number().min(0).default(10000),
  faiz: z.number().min(0).default(10),
  yil: z.number().min(0).default(5),
  siklik: z.number().min(1).default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bilesik_faiz_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.anapara * Math.pow(1 + (input.faiz / 100) / Math.max(1, input.siklik), input.siklik * input.yil); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBilesik_faiz_hesaplama(input: Bilesik_faiz_hesaplamaInput): Bilesik_faiz_hesaplamaOutput {
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


export interface Bilesik_faiz_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bilesik_faiz_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

