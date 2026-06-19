// Auto-generated from relative-standard-deviation-calculator-schema.json
import * as z from 'zod';

export interface Relative_standard_deviation_calculatorInput {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  dataConfidence?: number;
}

export const Relative_standard_deviation_calculatorInputSchema = z.object({
  value1: z.number().default(0),
  value2: z.number().default(0),
  value3: z.number().default(0),
  value4: z.number().default(0),
  value5: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Relative_standard_deviation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.value1 + input.value2 + input.value3 + input.value4 + input.value5) / 5; results["mean"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = (input.value1 + input.value2 + input.value3 + input.value4 + input.value5) / 5; results["mean_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mean_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRelative_standard_deviation_calculator(input: Relative_standard_deviation_calculatorInput): Relative_standard_deviation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["mean_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Relative_standard_deviation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
