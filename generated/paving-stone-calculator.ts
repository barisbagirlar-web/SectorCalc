// Auto-generated from paving-stone-calculator-schema.json
import * as z from 'zod';

export interface Paving_stone_calculatorInput {
  dataConfidence?: number;
  alan: number;
  tasEn: number;
  tasBoy: number;
  fire: number;
}

export const Paving_stone_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(30),
  tasEn: z.number().min(0).default(0.1),
  tasBoy: z.number().min(0).default(0.2),
  fire: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Paving_stone_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil((input["alan"] / Math.max(0.0001, (input["tasEn"] * input["tasBoy"]))) * (1 + input["fire"] / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePaving_stone_calculator(input: Paving_stone_calculatorInput): Paving_stone_calculatorOutput {
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
    unit: "stones",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Paving_stone_calculatorOutput {
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

export const Paving_stone_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "stones",
  breakdownKeys: [],
} as const;
