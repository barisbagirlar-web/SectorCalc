// Auto-generated from percent-difference-calculator-schema.json
import * as z from 'zod';

export interface Percent_difference_calculatorInput {
  value1: number;
  value2: number;
  referenceValue: number;
  tolerance: number;
  dataConfidence?: number;
}

export const Percent_difference_calculatorInputSchema = z.object({
  value1: z.number().default(0),
  value2: z.number().default(0),
  referenceValue: z.number().default(0),
  tolerance: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Percent_difference_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.value1 + input.value2) / 2; results["avg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["avg"] = Number.NaN; }
  try { const v = (input.value1 + input.value2) / 2; results["avg_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["avg_aux"] = Number.NaN; }
  return results;
}


export function calculatePercent_difference_calculator(input: Percent_difference_calculatorInput): Percent_difference_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["avg_aux"]);
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


export interface Percent_difference_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
