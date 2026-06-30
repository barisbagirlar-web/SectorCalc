// Auto-generated from spray-paint-calculator-schema.json
import * as z from 'zod';

export interface Spray_paint_calculatorInput {
  dataConfidence?: number;
  alan: number;
  katSayisi: number;
  ortmeOrani: number;
}

export const Spray_paint_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(20),
  katSayisi: z.number().min(1).default(2),
  ortmeOrani: z.number().min(0).default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spray_paint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["alan"] * input["katSayisi"]) / Math.max(0.0001, input["ortmeOrani"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSpray_paint_calculator(input: Spray_paint_calculatorInput): Spray_paint_calculatorOutput {
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

export interface Spray_paint_calculatorOutput {
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

export const Spray_paint_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "L",
  breakdownKeys: [],
} as const;
