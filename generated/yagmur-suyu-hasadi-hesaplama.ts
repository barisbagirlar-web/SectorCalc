// Auto-generated from yagmur-suyu-hasadi-hesaplama-schema.json
import * as z from 'zod';

export interface Yagmur_suyu_hasadi_hesaplamaInput {
  catiAlani: number;
  yillikYagis: number;
  verim: number;
  dataConfidence?: number;
}

export const Yagmur_suyu_hasadi_hesaplamaInputSchema = z.object({
  catiAlani: z.number().min(0).default(150),
  yillikYagis: z.number().min(0).default(600),
  verim: z.number().min(0).default(85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yagmur_suyu_hasadi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.catiAlani * (input.yillikYagis / 1000)) * (input.verim / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYagmur_suyu_hasadi_hesaplama(input: Yagmur_suyu_hasadi_hesaplamaInput): Yagmur_suyu_hasadi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "m3",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Yagmur_suyu_hasadi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yagmur_suyu_hasadi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m3",
  breakdownKeys: ["sonuc"],
} as const;

