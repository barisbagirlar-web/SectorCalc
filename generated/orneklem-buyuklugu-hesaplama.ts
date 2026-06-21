// Auto-generated from orneklem-buyuklugu-hesaplama-schema.json
import * as z from 'zod';

export interface Orneklem_buyuklugu_hesaplamaInput {
  Z: number;
  stdSapma: number;
  hataPayi: number;
  dataConfidence?: number;
}

export const Orneklem_buyuklugu_hesaplamaInputSchema = z.object({
  Z: z.number().min(0).default(1.96),
  stdSapma: z.number().min(0).default(10),
  hataPayi: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Orneklem_buyuklugu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(Math.pow((input.Z * input.stdSapma / Math.max(0.0001, input.hataPayi)), 2)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOrneklem_buyuklugu_hesaplama(input: Orneklem_buyuklugu_hesaplamaInput): Orneklem_buyuklugu_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify statistical assumptions before making decisions.","Use larger sample sizes for better accuracy."];
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
    unit: "samples",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Orneklem_buyuklugu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Orneklem_buyuklugu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "samples",
  breakdownKeys: ["sonuc"],
} as const;

