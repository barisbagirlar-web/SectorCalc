// Auto-generated from intermediate-value-theorem-checker-calculator-schema.json
import * as z from 'zod';

export interface Intermediate_value_theorem_checker_calculatorInput {
  a: number;
  b: number;
  f_a: number;
  f_b: number;
  k: number;
}

export const Intermediate_value_theorem_checker_calculatorInputSchema = z.object({
  a: z.number().default(0),
  b: z.number().default(1),
  f_a: z.number().default(-1),
  f_b: z.number().default(1),
  k: z.number().default(0),
});

function evaluateAllFormulas(input: Intermediate_value_theorem_checker_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.f_a <= input.k && input.k <= input.f_b) || (input.f_b <= input.k && input.k <= input.f_a)) ? 'Yes, input.a c exists.' : 'No, no guarantee.'; results["existsString"] = Number.isFinite(v) ? v : 0; } catch { results["existsString"] = 0; }
  try { const v = 'f(input.a)=' + input.f_a + ', f(input.b)=' + input.f_b + ', input.k=' + input.k + ': input.k is ' + (((input.f_a <= input.k && input.k <= input.f_b) || (input.f_b <= input.k && input.k <= input.f_a)) ? 'inside' : 'outside') + ' the range.'; results["conditionDetail"] = Number.isFinite(v) ? v : 0; } catch { results["conditionDetail"] = 0; }
  try { const v = 'Interval: '; results["intervalInfo"] = Number.isFinite(v) ? v : 0; } catch { results["intervalInfo"] = 0; }
  return results;
}


export function calculateIntermediate_value_theorem_checker_calculator(input: Intermediate_value_theorem_checker_calculatorInput): Intermediate_value_theorem_checker_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["existsString"] ?? 0;
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


export interface Intermediate_value_theorem_checker_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
