// Auto-generated from one-sample-t-test-calculator-schema.json
import * as z from 'zod';

export interface One_sample_t_test_calculatorInput {
  sampleMean: number;
  sampleStdDev: number;
  sampleSize: number;
  hypothesizedMean: number;
}

export const One_sample_t_test_calculatorInputSchema = z.object({
  sampleMean: z.number().default(10),
  sampleStdDev: z.number().default(2),
  sampleSize: z.number().default(30),
  hypothesizedMean: z.number().default(9),
});

function evaluateAllFormulas(input: One_sample_t_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sampleMean - input.hypothesizedMean) / (input.sampleStdDev / Math.sqrt(input.sampleSize)); results["tStatistic"] = Number.isFinite(v) ? v : 0; } catch { results["tStatistic"] = 0; }
  try { const v = input.sampleStdDev / Math.sqrt(input.sampleSize); results["standardError"] = Number.isFinite(v) ? v : 0; } catch { results["standardError"] = 0; }
  try { const v = input.sampleSize - 1; results["degreesOfFreedom"] = Number.isFinite(v) ? v : 0; } catch { results["degreesOfFreedom"] = 0; }
  try { const v = input.sampleMean - input.hypothesizedMean; results["meanDifference"] = Number.isFinite(v) ? v : 0; } catch { results["meanDifference"] = 0; }
  return results;
}


export function calculateOne_sample_t_test_calculator(input: One_sample_t_test_calculatorInput): One_sample_t_test_calculatorOutput {
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


export interface One_sample_t_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
