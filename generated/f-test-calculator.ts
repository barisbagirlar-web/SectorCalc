// Auto-generated from f-test-calculator-schema.json
import * as z from 'zod';

export interface F_test_calculatorInput {
  ss1: number;
  df1: number;
  ss2: number;
  df2: number;
}

export const F_test_calculatorInputSchema = z.object({
  ss1: z.number().default(0),
  df1: z.number().default(1),
  ss2: z.number().default(0),
  df2: z.number().default(1),
});

function evaluateAllFormulas(input: F_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ss1 / input.df1; results["ms1"] = Number.isFinite(v) ? v : 0; } catch { results["ms1"] = 0; }
  try { const v = input.ss2 / input.df2; results["ms2"] = Number.isFinite(v) ? v : 0; } catch { results["ms2"] = 0; }
  try { const v = (results["ms1"] ?? 0) / (results["ms2"] ?? 0); results["f_statistic"] = Number.isFinite(v) ? v : 0; } catch { results["f_statistic"] = 0; }
  return results;
}


export function calculateF_test_calculator(input: F_test_calculatorInput): F_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["f_statistic"] ?? 0;
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


export interface F_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
