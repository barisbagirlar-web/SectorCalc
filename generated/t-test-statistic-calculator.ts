// Auto-generated from t-test-statistic-calculator-schema.json
import * as z from 'zod';

export interface T_test_statistic_calculatorInput {
  sampleMean: number;
  populationMean: number;
  standardDeviation: number;
  sampleSize: number;
  dataConfidence?: number;
}

export const T_test_statistic_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  populationMean: z.number().default(0),
  standardDeviation: z.number().default(1),
  sampleSize: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: T_test_statistic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleMean - input.populationMean; results["meanDifference"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meanDifference"] = Number.NaN; }
  try { const v = input.sampleSize - 1; results["degreesOfFreedom"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["degreesOfFreedom"] = Number.NaN; }
  return results;
}


export function calculateT_test_statistic_calculator(input: T_test_statistic_calculatorInput): T_test_statistic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["degreesOfFreedom"]);
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


export interface T_test_statistic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
