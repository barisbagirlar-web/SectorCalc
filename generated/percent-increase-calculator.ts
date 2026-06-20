// Auto-generated from percent-increase-calculator-schema.json
import * as z from 'zod';

export interface Percent_increase_calculatorInput {
  originalValue: number;
  newValue: number;
  decimalPlaces: number;
  thresholdPercent: number;
  dataConfidence?: number;
}

export const Percent_increase_calculatorInputSchema = z.object({
  originalValue: z.number().default(100),
  newValue: z.number().default(120),
  decimalPlaces: z.number().default(2),
  thresholdPercent: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Percent_increase_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.newValue - input.originalValue; results["absoluteIncrease"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["absoluteIncrease"] = Number.NaN; }
  try { const v = ((input.newValue - input.originalValue) / input.originalValue) * 100; results["percentIncrease"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["percentIncrease"] = Number.NaN; }
  return results;
}


export function calculatePercent_increase_calculator(input: Percent_increase_calculatorInput): Percent_increase_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["percentIncrease"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Percent_increase_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
