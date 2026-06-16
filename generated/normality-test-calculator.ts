// Auto-generated from normality-test-calculator-schema.json
import * as z from 'zod';

export interface Normality_test_calculatorInput {
  sampleSize: number;
  skewness: number;
  excessKurtosis: number;
  criticalZ: number;
}

export const Normality_test_calculatorInputSchema = z.object({
  sampleSize: z.number().default(30),
  skewness: z.number().default(0),
  excessKurtosis: z.number().default(0),
  criticalZ: z.number().default(2),
});

function evaluateAllFormulas(input: Normality_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.abs(input.skewness / Math.sqrt(6 / input.sampleSize)) <= input.criticalZ && Math.abs(input.excessKurtosis / Math.sqrt(24 / input.sampleSize)) <= input.criticalZ) ? 1 : 0; results["isNormal"] = Number.isFinite(v) ? v : 0; } catch { results["isNormal"] = 0; }
  try { const v = input.skewness / Math.sqrt(6 / input.sampleSize); results["zSkew"] = Number.isFinite(v) ? v : 0; } catch { results["zSkew"] = 0; }
  try { const v = input.excessKurtosis / Math.sqrt(24 / input.sampleSize); results["zKurt"] = Number.isFinite(v) ? v : 0; } catch { results["zKurt"] = 0; }
  try { const v = Math.sqrt(6 / input.sampleSize); results["seSkew"] = Number.isFinite(v) ? v : 0; } catch { results["seSkew"] = 0; }
  try { const v = Math.sqrt(24 / input.sampleSize); results["seKurt"] = Number.isFinite(v) ? v : 0; } catch { results["seKurt"] = 0; }
  return results;
}


export function calculateNormality_test_calculator(input: Normality_test_calculatorInput): Normality_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["isNormal"] ?? 0;
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


export interface Normality_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
