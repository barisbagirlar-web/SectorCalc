// Auto-generated from polynomial-calculator-schema.json
import * as z from 'zod';

export interface Polynomial_calculatorInput {
  a4: number;
  a3: number;
  a2: number;
  a1: number;
  a0: number;
  x: number;
}

export const Polynomial_calculatorInputSchema = z.object({
  a4: z.number().default(0),
  a3: z.number().default(0),
  a2: z.number().default(0),
  a1: z.number().default(1),
  a0: z.number().default(0),
  x: z.number().default(1),
});

function evaluateAllFormulas(input: Polynomial_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a4 * input.x ** 4; results["term4"] = Number.isFinite(v) ? v : 0; } catch { results["term4"] = 0; }
  try { const v = input.a3 * input.x ** 3; results["term3"] = Number.isFinite(v) ? v : 0; } catch { results["term3"] = 0; }
  try { const v = input.a2 * input.x ** 2; results["term2"] = Number.isFinite(v) ? v : 0; } catch { results["term2"] = 0; }
  try { const v = input.a1 * input.x; results["term1"] = Number.isFinite(v) ? v : 0; } catch { results["term1"] = 0; }
  try { const v = input.a0; results["term0"] = Number.isFinite(v) ? v : 0; } catch { results["term0"] = 0; }
  try { const v = (results["term4"] ?? 0) + (results["term3"] ?? 0) + (results["term2"] ?? 0) + (results["term1"] ?? 0) + (results["term0"] ?? 0); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculatePolynomial_calculator(input: Polynomial_calculatorInput): Polynomial_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Polynomial_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
