// Auto-generated from polynomial-solver-calculator-schema.json
import * as z from 'zod';

export interface Polynomial_solver_calculatorInput {
  a: number;
  b: number;
  c: number;
  x: number;
}

export const Polynomial_solver_calculatorInputSchema = z.object({
  a: z.number().default(1),
  b: z.number().default(0),
  c: z.number().default(0),
  x: z.number().default(0),
});

function evaluateAllFormulas(input: Polynomial_solver_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.b*input.b - 4*input.a*input.c; results["discriminant"] = Number.isFinite(v) ? v : 0; } catch { results["discriminant"] = 0; }
  try { const v = (input.b*input.b - 4*input.a*input.c) >= 0 ? (-input.b + Math.sqrt(input.b*input.b - 4*input.a*input.c)) / (2*input.a) : 'No real roots'; results["root1"] = Number.isFinite(v) ? v : 0; } catch { results["root1"] = 0; }
  try { const v = (input.b*input.b - 4*input.a*input.c) >= 0 ? (-input.b - Math.sqrt(input.b*input.b - 4*input.a*input.c)) / (2*input.a) : 'No real roots'; results["root2"] = Number.isFinite(v) ? v : 0; } catch { results["root2"] = 0; }
  try { const v = input.a*input.x*input.x + input.b*input.x + input.c; results["evaluated"] = Number.isFinite(v) ? v : 0; } catch { results["evaluated"] = 0; }
  try { const v = (input.b*input.b - 4*input.a*input.c) >= 0 ? 'Real roots: ' + ((-input.b + Math.sqrt(input.b*input.b - 4*input.a*input.c))/(2*input.a)).toFixed(4) + ', ' + ((-input.b - Math.sqrt(input.b*input.b - 4*input.a*input.c))/(2*input.a)).toFixed(4) : 'No real roots'; results["rootsSummary"] = Number.isFinite(v) ? v : 0; } catch { results["rootsSummary"] = 0; }
  return results;
}


export function calculatePolynomial_solver_calculator(input: Polynomial_solver_calculatorInput): Polynomial_solver_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rootsSummary"] ?? 0;
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


export interface Polynomial_solver_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
