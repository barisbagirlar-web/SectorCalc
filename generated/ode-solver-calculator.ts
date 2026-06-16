// Auto-generated from ode-solver-calculator-schema.json
import * as z from 'zod';

export interface Ode_solver_calculatorInput {
  a: number;
  b: number;
  t0: number;
  y0: number;
  h: number;
  n: number;
}

export const Ode_solver_calculatorInputSchema = z.object({
  a: z.number().default(1),
  b: z.number().default(0),
  t0: z.number().default(0),
  y0: z.number().default(1),
  h: z.number().default(0.1),
  n: z.number().default(10),
});

function evaluateAllFormulas(input: Ode_solver_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.t0 + input.n * input.h; results["t_final"] = Number.isFinite(v) ? v : 0; } catch { results["t_final"] = 0; }
  try { const v = input.y0 + input.b / input.a; results["constant_C"] = Number.isFinite(v) ? v : 0; } catch { results["constant_C"] = 0; }
  try { const v = (results["constant_C"] ?? 0) * Math.exp(input.a * ((results["t_final"] ?? 0) - input.t0)) - (input.b / input.a); results["y_final"] = Number.isFinite(v) ? v : 0; } catch { results["y_final"] = 0; }
  return results;
}


export function calculateOde_solver_calculator(input: Ode_solver_calculatorInput): Ode_solver_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["y_final"] ?? 0;
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


export interface Ode_solver_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
