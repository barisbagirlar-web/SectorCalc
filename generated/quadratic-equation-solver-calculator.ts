// Auto-generated from quadratic-equation-solver-calculator-schema.json
import * as z from 'zod';

export interface Quadratic_equation_solver_calculatorInput {
  a: number;
  b: number;
  c: number;
  x: number;
  dataConfidence?: number;
}

export const Quadratic_equation_solver_calculatorInputSchema = z.object({
  a: z.number().default(1),
  b: z.number().default(0),
  c: z.number().default(0),
  x: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Quadratic_equation_solver_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.b*input.b - 4*input.a*input.c; results["discriminant"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discriminant"] = Number.NaN; }
  try { const v = -input.b/(2*input.a); results["vertexX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vertexX"] = Number.NaN; }
  try { const v = input.c - (input.b*input.b)/(4*input.a); results["vertexY"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vertexY"] = Number.NaN; }
  try { const v = input.a*input.x*input.x + input.b*input.x + input.c; results["evalAtX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["evalAtX"] = Number.NaN; }
  return results;
}


export function calculateQuadratic_equation_solver_calculator(input: Quadratic_equation_solver_calculatorInput): Quadratic_equation_solver_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["evalAtX"]);
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


export interface Quadratic_equation_solver_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
