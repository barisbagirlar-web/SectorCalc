// Auto-generated from joint-compound-calculator-schema.json
import * as z from 'zod';

export interface Joint_compound_calculatorInput {
  dataConfidence?: number;
  alan: number;
  sarfiyat: number;
}

export const Joint_compound_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(80),
  sarfiyat: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Joint_compound_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["alan"] * input["sarfiyat"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateJoint_compound_calculator(input: Joint_compound_calculatorInput): Joint_compound_calculatorOutput {
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Joint_compound_calculatorOutput {
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

export const Joint_compound_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg",
  breakdownKeys: [],
} as const;
