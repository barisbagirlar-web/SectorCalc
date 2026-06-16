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

function evaluateAllFormulas(input: Two_sample_t_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((input.sample1StdDev ** 2 / input.sample1Size) + (input.sample2StdDev ** 2 / input.sample2Size)); results["standardError"] = Number.isFinite(v) ? v : 0; } catch { results["standardError"] = 0; }
  try { const v = ((input.sample1StdDev ** 2 / input.sample1Size + input.sample2StdDev ** 2 / input.sample2Size) ** 2) / (((input.sample1StdDev ** 2 / input.sample1Size) ** 2) / (input.sample1Size - 1) + ((input.sample2StdDev ** 2 / input.sample2Size) ** 2) / (input.sample2Size - 1)); results["degreesOfFreedom"] = Number.isFinite(v) ? v : 0; } catch { results["degreesOfFreedom"] = 0; }
  try { const v = (input.sample1Mean - input.sample2Mean) / Math.sqrt((input.sample1StdDev ** 2 / input.sample1Size) + (input.sample2StdDev ** 2 / input.sample2Size)); results["tStatistic"] = Number.isFinite(v) ? v : 0; } catch { results["tStatistic"] = 0; }
  return results;
}


export function calculateTwo_sample_t_test_calculator(input: Two_sample_t_test_calculatorInput): Two_sample_t_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tStatistic"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
