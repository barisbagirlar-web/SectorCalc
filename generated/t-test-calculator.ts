// Auto-generated from t-test-calculator-schema.json
import * as z from 'zod';

export interface T_test_calculatorInput {
  sampleMean: number;
  hypothesizedMean: number;
  sampleSD: number;
  sampleSize: number;
}

export const T_test_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  hypothesizedMean: z.number().default(0),
  sampleSD: z.number().default(1),
  sampleSize: z.number().default(30),
});

function evaluateAllFormulas(input: T_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleMean - input.hypothesizedMean; results["meanDifference"] = Number.isFinite(v) ? v : 0; } catch { results["meanDifference"] = 0; }
  try { const v = input.sampleSD / Math.sqrt(input.sampleSize); results["standardError"] = Number.isFinite(v) ? v : 0; } catch { results["standardError"] = 0; }
  try { const v = (input.sampleMean - input.hypothesizedMean) / (input.sampleSD / Math.sqrt(input.sampleSize)); results["tStatistic"] = Number.isFinite(v) ? v : 0; } catch { results["tStatistic"] = 0; }
  return results;
}


export function calculateT_test_calculator(input: T_test_calculatorInput): T_test_calculatorOutput {
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


export interface T_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
