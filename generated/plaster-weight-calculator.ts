// Auto-generated from plaster-weight-calculator-schema.json
import * as z from 'zod';

export interface Plaster_weight_calculatorInput {
  dataConfidence?: number;
  alan: number;
  kalinlik: number;
  yogunluk: number;
}

export const Plaster_weight_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(100),
  kalinlik: z.number().min(0).default(2),
  yogunluk: z.number().min(0).default(1800),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Plaster_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["alan"] * (input["kalinlik"] / 100) * input["yogunluk"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePlaster_weight_calculator(input: Plaster_weight_calculatorInput): Plaster_weight_calculatorOutput {
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

export interface Plaster_weight_calculatorOutput {
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

export const Plaster_weight_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg",
  breakdownKeys: [],
} as const;
