// Auto-generated from rolle-theorem-quadratic-calculator-schema.json
import * as z from 'zod';

export interface Rolle_theorem_quadratic_calculatorInput {
  a: number;
  bCoef: number;
  cConst: number;
  x1: number;
  x2: number;
  dataConfidence?: number;
}

export const Rolle_theorem_quadratic_calculatorInputSchema = z.object({
  a: z.number().default(1),
  bCoef: z.number().default(0),
  cConst: z.number().default(0),
  x1: z.number().default(-1),
  x2: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rolle_theorem_quadratic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a*input.x1*input.x1 + input.bCoef*input.x1 + input.cConst; results["f_x1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["f_x1"] = 0; }
  try { const v = input.a*input.x2*input.x2 + input.bCoef*input.x2 + input.cConst; results["f_x2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["f_x2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRolle_theorem_quadratic_calculator(input: Rolle_theorem_quadratic_calculatorInput): Rolle_theorem_quadratic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["f_x2"]);
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


export interface Rolle_theorem_quadratic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
