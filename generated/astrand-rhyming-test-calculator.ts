// Auto-generated from astrand-rhyming-test-calculator-schema.json
import * as z from 'zod';

export interface Astrand_rhyming_test_calculatorInput {
  sex: number;
  age: number;
  weight: number;
  workRate: number;
  heartRate: number;
  dataConfidence?: number;
}

export const Astrand_rhyming_test_calculatorInputSchema = z.object({
  sex: z.number().default(1),
  age: z.number().default(25),
  weight: z.number().default(70),
  workRate: z.number().default(100),
  heartRate: z.number().default(140),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Astrand_rhyming_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workRate * 6.118; results["workRateKgm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["workRateKgm"] = 0; }
  try { const v = input.sex == 1 ? 1 : 0.85; results["genderFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["genderFactor"] = 0; }
  try { const v = (1.8 * (asFormulaNumber(results["workRateKgm"]))) / (input.heartRate - 60); results["baseVO2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseVO2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAstrand_rhyming_test_calculator(input: Astrand_rhyming_test_calculatorInput): Astrand_rhyming_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["baseVO2"]);
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


export interface Astrand_rhyming_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
