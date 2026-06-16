// Auto-generated from quadratic-equation-solver-calculator-schema.json
import * as z from 'zod';

export interface Quadratic_equation_solver_calculatorInput {
  a: number;
  b: number;
  c: number;
  x: number;
}

export const Quadratic_equation_solver_calculatorInputSchema = z.object({
  a: z.number().default(1),
  b: z.number().default(0),
  c: z.number().default(0),
  x: z.number().default(0),
});

function evaluateAllFormulas(input: Quadratic_equation_solver_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.b*input.b - 4*input.a*input.c; results["discriminant"] = Number.isFinite(v) ? v : 0; } catch { results["discriminant"] = 0; }
  try { const v = (-input.b + Math.sqrt(input.b*input.b - 4*input.a*input.c)) / (2*input.a); results["root1"] = Number.isFinite(v) ? v : 0; } catch { results["root1"] = 0; }
  try { const v = (-input.b - Math.sqrt(input.b*input.b - 4*input.a*input.c)) / (2*input.a); results["root2"] = Number.isFinite(v) ? v : 0; } catch { results["root2"] = 0; }
  try { const v = -input.b/(2*input.a); results["vertexX"] = Number.isFinite(v) ? v : 0; } catch { results["vertexX"] = 0; }
  try { const v = input.c - (input.b*input.b)/(4*input.a); results["vertexY"] = Number.isFinite(v) ? v : 0; } catch { results["vertexY"] = 0; }
  try { const v = input.a*input.x*input.x + input.b*input.x + input.c; results["evalAtX"] = Number.isFinite(v) ? v : 0; } catch { results["evalAtX"] = 0; }
  try { const v = 'Roots: input.x₁ = ' + ((-input.b + Math.sqrt(input.b*input.b - 4*input.a*input.c)) / (2*input.a)).toFixed(4) + ', input.x₂ = ' + ((-input.b - Math.sqrt(input.b*input.b - 4*input.a*input.c)) / (2*input.a)).toFixed(4) + '. Vertex: (' + (-input.b/(2*input.a)).toFixed(4) + ', ' + (input.c - (input.b*input.b)/(4*input.a)).toFixed(4) + '). f(' + input.x + ') = ' + (input.a*input.x*input.x + input.b*input.x + input.c).toFixed(4); results["primaryOutput"] = Number.isFinite(v) ? v : 0; } catch { results["primaryOutput"] = 0; }
  return results;
}


export function calculateQuadratic_equation_solver_calculator(input: Quadratic_equation_solver_calculatorInput): Quadratic_equation_solver_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryOutput"] ?? 0;
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


export interface Quadratic_equation_solver_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
