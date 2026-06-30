// Auto-generated from wood-stain-calculator-schema.json
import * as z from 'zod';

export interface Wood_stain_calculatorInput {
  dataConfidence?: number;
  alan: number;
  sarfiyat: number;
}

export const Wood_stain_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(30),
  sarfiyat: z.number().min(0).default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wood_stain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["alan"] / Math.max(0.0001, input["sarfiyat"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateWood_stain_calculator(input: Wood_stain_calculatorInput): Wood_stain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "L",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Wood_stain_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Wood_stain_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "L",
  breakdownKeys: [],
} as const;
