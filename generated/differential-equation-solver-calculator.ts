// Auto-generated from differential-equation-solver-calculator-schema.json
import * as z from 'zod';

export interface Differential_equation_solver_calculatorInput {
  y0: number;
  a: number;
  b: number;
  t0: number;
  t: number;
}

export const Differential_equation_solver_calculatorInputSchema = z.object({
  y0: z.number().default(1),
  a: z.number().default(0.1),
  b: z.number().default(0),
  t0: z.number().default(0),
  t: z.number().default(1),
});

function evaluateAllFormulas(input: Differential_equation_solver_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a !== 0 ? (input.y0 + input.b/input.a) * Math.exp(input.a * (input.t - input.t0)) - input.b/input.a : input.y0 + input.b * (input.t - input.t0); results["y"] = Number.isFinite(v) ? v : 0; } catch { results["y"] = 0; }
  try { const v = input.a * (results["y"] ?? 0) + input.b; results["derivative"] = Number.isFinite(v) ? v : 0; } catch { results["derivative"] = 0; }
  return results;
}


export function calculateDifferential_equation_solver_calculator(input: Differential_equation_solver_calculatorInput): Differential_equation_solver_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["y"] ?? 0;
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


export interface Differential_equation_solver_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
