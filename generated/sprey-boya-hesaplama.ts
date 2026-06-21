// Auto-generated from sprey-boya-hesaplama-schema.json
import * as z from 'zod';

export interface Sprey_boya_hesaplamaInput {
  alan: number;
  katSayisi: number;
  ortmeOrani: number;
  dataConfidence?: number;
}

export const Sprey_boya_hesaplamaInputSchema = z.object({
  alan: z.number().min(0).default(20),
  katSayisi: z.number().min(1).default(2),
  ortmeOrani: z.number().min(0).default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sprey_boya_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.alan * input.katSayisi) / Math.max(0.0001, input.ortmeOrani); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSprey_boya_hesaplama(input: Sprey_boya_hesaplamaInput): Sprey_boya_hesaplamaOutput {
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
    unit: "L",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sprey_boya_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sprey_boya_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "L",
  breakdownKeys: ["sonuc"],
} as const;

