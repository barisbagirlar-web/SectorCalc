// Auto-generated from percent-decrease-calculator-schema.json
import * as z from 'zod';

export interface Percent_decrease_calculatorInput {
  initialValue: number;
  finalValue: number;
  precision: number;
  adjustmentFactor: number;
  targetDecreasePercent: number;
  dataConfidence?: number;
}

export const Percent_decrease_calculatorInputSchema = z.object({
  initialValue: z.number().default(1000),
  finalValue: z.number().default(800),
  precision: z.number().default(2),
  adjustmentFactor: z.number().default(1),
  targetDecreasePercent: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Percent_decrease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialValue - input.finalValue; results["absoluteDecrease"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["absoluteDecrease"] = 0; }
  try { const v = input.initialValue - input.finalValue; results["absoluteDecrease_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["absoluteDecrease_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePercent_decrease_calculator(input: Percent_decrease_calculatorInput): Percent_decrease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["absoluteDecrease_aux"]);
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


export interface Percent_decrease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
