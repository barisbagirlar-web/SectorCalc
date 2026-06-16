// Auto-generated from paired-t-test-calculator-schema.json
import * as z from 'zod';

export interface Paired_t_test_calculatorInput {
  meanDifference: number;
  standardDeviationDifference: number;
  sampleSize: number;
  hypothesizedDifference: number;
}

export const Paired_t_test_calculatorInputSchema = z.object({
  meanDifference: z.number().default(0),
  standardDeviationDifference: z.number().default(1),
  sampleSize: z.number().default(10),
  hypothesizedDifference: z.number().default(0),
});

function evaluateAllFormulas(input: Paired_t_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.meanDifference - input.hypothesizedDifference) / (input.standardDeviationDifference / Math.sqrt(input.sampleSize)); results["tStatistic"] = Number.isFinite(v) ? v : 0; } catch { results["tStatistic"] = 0; }
  try { const v = input.sampleSize - 1; results["degreesOfFreedom"] = Number.isFinite(v) ? v : 0; } catch { results["degreesOfFreedom"] = 0; }
  try { const v = input.standardDeviationDifference / Math.sqrt(input.sampleSize); results["standardError"] = Number.isFinite(v) ? v : 0; } catch { results["standardError"] = 0; }
  try { const v = input.meanDifference; results["meanDifference"] = Number.isFinite(v) ? v : 0; } catch { results["meanDifference"] = 0; }
  return results;
}


export function calculatePaired_t_test_calculator(input: Paired_t_test_calculatorInput): Paired_t_test_calculatorOutput {
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


export interface Paired_t_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
