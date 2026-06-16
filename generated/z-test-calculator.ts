// Auto-generated from z-test-calculator-schema.json
import * as z from 'zod';

export interface Z_test_calculatorInput {
  sample_mean: number;
  population_mean: number;
  standard_deviation: number;
  sample_size: number;
  alpha: number;
  tails: number;
}

export const Z_test_calculatorInputSchema = z.object({
  sample_mean: z.number().default(0),
  population_mean: z.number().default(0),
  standard_deviation: z.number().default(1),
  sample_size: z.number().default(30),
  alpha: z.number().default(0.05),
  tails: z.number().default(2),
});

function evaluateAllFormulas(input: Z_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.sample_mean - input.population_mean) / (input.standard_deviation / Math.sqrt(input.sample_size))); results["z_score"] = Number.isFinite(v) ? v : 0; } catch { results["z_score"] = 0; }
  try { const v = input.tails === 2 ? 2 * (1 - (1 / (1 + Math.exp(-1.59791 * Math.abs((results["z_score"] ?? 0)))))) : ((results["z_score"] ?? 0) > 0 ? (1 - (1 / (1 + Math.exp(-1.59791 * (results["z_score"] ?? 0))))) : (1 / (1 + Math.exp(-1.59791 * (results["z_score"] ?? 0))))); results["p_value"] = Number.isFinite(v) ? v : 0; } catch { results["p_value"] = 0; }
  try { const v = (results["p_value"] ?? 0) < input.alpha ? 'Reject H₀' : 'Fail to reject H₀'; results["decision"] = Number.isFinite(v) ? v : 0; } catch { results["decision"] = 0; }
  return results;
}


export function calculateZ_test_calculator(input: Z_test_calculatorInput): Z_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["z_score"] ?? 0;
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


export interface Z_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
