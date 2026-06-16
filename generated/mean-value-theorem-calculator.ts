// Auto-generated from mean-value-theorem-calculator-schema.json
import * as z from 'zod';

export interface Mean_value_theorem_calculatorInput {
  A: number;
  B: number;
  C: number;
  a: number;
  b: number;
}

export const Mean_value_theorem_calculatorInputSchema = z.object({
  A: z.number().default(1),
  B: z.number().default(0),
  C: z.number().default(0),
  a: z.number().default(0),
  b: z.number().default(1),
});

function evaluateAllFormulas(input: Mean_value_theorem_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.A * input.a**2 + input.B * input.a + input.C; results["f_a"] = Number.isFinite(v) ? v : 0; } catch { results["f_a"] = 0; }
  try { const v = input.A * input.b**2 + input.B * input.b + input.C; results["f_b"] = Number.isFinite(v) ? v : 0; } catch { results["f_b"] = 0; }
  try { const v = ((results["f_b"] ?? 0) - (results["f_a"] ?? 0)) / (input.b - input.a); results["slope"] = Number.isFinite(v) ? v : 0; } catch { results["slope"] = 0; }
  try { const v = ((results["slope"] ?? 0) - input.B) / (2 * input.A); results["c"] = Number.isFinite(v) ? v : 0; } catch { results["c"] = 0; }
  try { const v = 2 * input.A * (results["c"] ?? 0) + input.B; results["f_prime_c"] = Number.isFinite(v) ? v : 0; } catch { results["f_prime_c"] = 0; }
  return results;
}


export function calculateMean_value_theorem_calculator(input: Mean_value_theorem_calculatorInput): Mean_value_theorem_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["c"] ?? 0;
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


export interface Mean_value_theorem_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
