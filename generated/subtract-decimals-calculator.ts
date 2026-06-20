// Auto-generated from subtract-decimals-calculator-schema.json
import * as z from 'zod';

export interface Subtract_decimals_calculatorInput {
  valueA: number;
  valueB: number;
  precision: number;
  offset: number;
  dataConfidence?: number;
}

export const Subtract_decimals_calculatorInputSchema = z.object({
  valueA: z.number().default(0),
  valueB: z.number().default(0),
  precision: z.number().default(2),
  offset: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Subtract_decimals_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.valueA - input.valueB; results["rawDifference"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawDifference"] = Number.NaN; }
  try { const v = input.valueA - input.valueB; results["rawDifference_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawDifference_aux"] = Number.NaN; }
  return results;
}


export function calculateSubtract_decimals_calculator(input: Subtract_decimals_calculatorInput): Subtract_decimals_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawDifference_aux"]);
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


export interface Subtract_decimals_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
