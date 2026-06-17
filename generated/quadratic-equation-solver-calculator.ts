// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Quadratic_equation_solver_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.b*input.b - 4*input.a*input.c; results["discriminant"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discriminant"] = 0; }
  try { const v = -input.b/(2*input.a); results["vertexX"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vertexX"] = 0; }
  try { const v = input.c - (input.b*input.b)/(4*input.a); results["vertexY"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vertexY"] = 0; }
  try { const v = input.a*input.x*input.x + input.b*input.x + input.c; results["evalAtX"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["evalAtX"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateQuadratic_equation_solver_calculator(input: Quadratic_equation_solver_calculatorInput): Quadratic_equation_solver_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["evalAtX"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
