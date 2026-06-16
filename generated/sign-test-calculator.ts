// Auto-generated from sign-test-calculator-schema.json
import * as z from 'zod';

export interface Sign_test_calculatorInput {
  sampleSize: number;
  posCount: number;
  p0: number;
  alpha: number;
  testType: number;
}

export const Sign_test_calculatorInputSchema = z.object({
  sampleSize: z.number().default(20),
  posCount: z.number().default(10),
  p0: z.number().default(0.5),
  alpha: z.number().default(0.05),
  testType: z.number().default(1),
});

function evaluateAllFormulas(input: Sign_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleSize * input.p0; results["expected"] = Number.isFinite(v) ? v : 0; } catch { results["expected"] = 0; }
  try { const v = Math.sqrt(input.sampleSize * input.p0 * (1 - input.p0)); results["stdDev"] = Number.isFinite(v) ? v : 0; } catch { results["stdDev"] = 0; }
  try { const v = (input.posCount > input.sampleSize*input.p0) ? (input.posCount - 0.5 - input.sampleSize*input.p0) / Math.sqrt(input.sampleSize*input.p0*(1-input.p0)) : (input.posCount < input.sampleSize*input.p0) ? (input.posCount + 0.5 - input.sampleSize*input.p0) / Math.sqrt(input.sampleSize*input.p0*(1-input.p0)) : 0; results["zStatistic"] = Number.isFinite(v) ? v : 0; } catch { results["zStatistic"] = 0; }
  try { const v = input.testType == 1 ? 2 * (1 - 0.5 * (1 + Math.erf(Math.abs((results["zStatistic"] ?? 0)) / Math.sqrt(2)))) : input.testType == 2 ? 1 - 0.5 * (1 + Math.erf((results["zStatistic"] ?? 0) / Math.sqrt(2))) : 0.5 * (1 + Math.erf((results["zStatistic"] ?? 0) / Math.sqrt(2))); results["pValue"] = Number.isFinite(v) ? v : 0; } catch { results["pValue"] = 0; }
  try { const v = (results["pValue"] ?? 0) < input.alpha ? 'Reject H0' : 'Fail to reject H0'; results["conclusion"] = Number.isFinite(v) ? v : 0; } catch { results["conclusion"] = 0; }
  return results;
}


export function calculateSign_test_calculator(input: Sign_test_calculatorInput): Sign_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pValue"] ?? 0;
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


export interface Sign_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
