// Auto-generated from pasteurization-time-calculator-schema.json
import * as z from 'zod';

export interface Pasteurization_time_calculatorInput {
  dataConfidence?: number;
  hacim: number;
  debi: number;
}

export const Pasteurization_time_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  hacim: z.number().min(0).default(5),
  debi: z.number().min(0).default(0.002),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pasteurization_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["hacim"] / Math.max(0.0001, input["debi"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePasteurization_time_calculator(input: Pasteurization_time_calculatorInput): Pasteurization_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Pasteurization_time_calculatorOutput {
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

export const Pasteurization_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: [],
} as const;
