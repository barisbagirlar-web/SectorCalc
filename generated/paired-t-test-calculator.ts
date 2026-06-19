// Auto-generated from paired-t-test-calculator-schema.json
import * as z from 'zod';

export interface Paired_t_test_calculatorInput {
  meanDifference: number;
  standardDeviationDifference: number;
  sampleSize: number;
  hypothesizedDifference: number;
  dataConfidence?: number;
}

export const Paired_t_test_calculatorInputSchema = z.object({
  meanDifference: z.number().default(0),
  standardDeviationDifference: z.number().default(1),
  sampleSize: z.number().default(10),
  hypothesizedDifference: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Paired_t_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.meanDifference * input.standardDeviationDifference * input.sampleSize * input.hypothesizedDifference; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.meanDifference * input.standardDeviationDifference * input.sampleSize * input.hypothesizedDifference; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePaired_t_test_calculator(input: Paired_t_test_calculatorInput): Paired_t_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Paired_t_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
