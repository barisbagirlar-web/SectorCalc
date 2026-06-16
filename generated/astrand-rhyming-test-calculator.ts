// Auto-generated from astrand-rhyming-test-calculator-schema.json
import * as z from 'zod';

export interface Astrand_rhyming_test_calculatorInput {
  sex: number;
  age: number;
  weight: number;
  workRate: number;
  heartRate: number;
}

export const Astrand_rhyming_test_calculatorInputSchema = z.object({
  sex: z.number().default(1),
  age: z.number().default(25),
  weight: z.number().default(70),
  workRate: z.number().default(100),
  heartRate: z.number().default(140),
});

function evaluateAllFormulas(input: Astrand_rhyming_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workRate * 6.118; results["workRateKgm"] = Number.isFinite(v) ? v : 0; } catch { results["workRateKgm"] = 0; }
  try { const v = input.sex == 1 ? 1 : 0.85; results["genderFactor"] = Number.isFinite(v) ? v : 0; } catch { results["genderFactor"] = 0; }
  try { const v = input.age <= 25 ? 1 : Math.max(0.5, 1 - 0.008 * (input.age - 25)); results["ageFactor"] = Number.isFinite(v) ? v : 0; } catch { results["ageFactor"] = 0; }
  try { const v = (1.8 * (results["workRateKgm"] ?? 0)) / (input.heartRate - 60); results["baseVO2"] = Number.isFinite(v) ? v : 0; } catch { results["baseVO2"] = 0; }
  try { const v = (results["baseVO2"] ?? 0) * (results["genderFactor"] ?? 0) * (results["ageFactor"] ?? 0); results["absoluteVO2"] = Number.isFinite(v) ? v : 0; } catch { results["absoluteVO2"] = 0; }
  try { const v = (results["absoluteVO2"] ?? 0) * 1000 / input.weight; results["relativeVO2"] = Number.isFinite(v) ? v : 0; } catch { results["relativeVO2"] = 0; }
  return results;
}


export function calculateAstrand_rhyming_test_calculator(input: Astrand_rhyming_test_calculatorInput): Astrand_rhyming_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["relativeVO2"] ?? 0;
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


export interface Astrand_rhyming_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
