// Auto-generated from two-sample-t-test-calculator-schema.json
import * as z from 'zod';

export interface Two_sample_t_test_calculatorInput {
  sample1Mean: number;
  sample1StdDev: number;
  sample1Size: number;
  sample2Mean: number;
  sample2StdDev: number;
  sample2Size: number;
  alpha: number;
  dataConfidence?: number;
}

export const Two_sample_t_test_calculatorInputSchema = z.object({
  sample1Mean: z.number().default(0),
  sample1StdDev: z.number().default(1),
  sample1Size: z.number().default(30),
  sample2Mean: z.number().default(0),
  sample2StdDev: z.number().default(1),
  sample2Size: z.number().default(30),
  alpha: z.number().default(0.05),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Two_sample_t_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.sample1StdDev ** 2 / input.sample1Size + input.sample2StdDev ** 2 / input.sample2Size) ** 2) / (((input.sample1StdDev ** 2 / input.sample1Size) ** 2) / (input.sample1Size - 1) + ((input.sample2StdDev ** 2 / input.sample2Size) ** 2) / (input.sample2Size - 1)); results["degreesOfFreedom"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["degreesOfFreedom"] = 0; }
  try { const v = ((input.sample1StdDev ** 2 / input.sample1Size + input.sample2StdDev ** 2 / input.sample2Size) ** 2) / (((input.sample1StdDev ** 2 / input.sample1Size) ** 2) / (input.sample1Size - 1) + ((input.sample2StdDev ** 2 / input.sample2Size) ** 2) / (input.sample2Size - 1)); results["degreesOfFreedom_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["degreesOfFreedom_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTwo_sample_t_test_calculator(input: Two_sample_t_test_calculatorInput): Two_sample_t_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["degreesOfFreedom_aux"]);
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


export interface Two_sample_t_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
