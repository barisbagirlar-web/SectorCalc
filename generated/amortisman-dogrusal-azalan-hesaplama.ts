// Auto-generated from amortisman-dogrusal-azalan-hesaplama-schema.json
import * as z from 'zod';

export interface Amortisman_dogrusal_azalan_hesaplamaInput {
  bedel: number;
  kalinti: number;
  omur: number;
  dataConfidence?: number;
}

export const Amortisman_dogrusal_azalan_hesaplamaInputSchema = z.object({
  bedel: z.number().min(0).default(50000),
  kalinti: z.number().min(0).default(5000),
  omur: z.number().min(1).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Amortisman_dogrusal_azalan_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bedel - input.kalinti) / Math.max(1, input.omur); results["dogrusal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dogrusal"] = Number.NaN; }
  try { const v = (input.bedel - input.kalinti) / Math.max(1, input.omur); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAmortisman_dogrusal_azalan_hesaplama(input: Amortisman_dogrusal_azalan_hesaplamaInput): Amortisman_dogrusal_azalan_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"]),
    dogrusal: toNumericFormulaValue(values["dogrusal"])
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


export interface Amortisman_dogrusal_azalan_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number; dogrusal: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Amortisman_dogrusal_azalan_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc","dogrusal"],
} as const;

