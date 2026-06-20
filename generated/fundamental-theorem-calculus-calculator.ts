// Auto-generated from fundamental-theorem-calculus-calculator-schema.json
import * as z from 'zod';

export interface Fundamental_theorem_calculus_calculatorInput {
  a: number;
  b: number;
  c0: number;
  c1: number;
  c2: number;
  c3: number;
  dataConfidence?: number;
}

export const Fundamental_theorem_calculus_calculatorInputSchema = z.object({
  a: z.number().default(0),
  b: z.number().default(1),
  c0: z.number().default(0),
  c1: z.number().default(0),
  c2: z.number().default(0),
  c3: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fundamental_theorem_calculus_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.c0*input.b + input.c1*(input.b**2)/2 + input.c2*(input.b**3)/3 + input.c3*(input.b**4)/4; results["Fb"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Fb"] = Number.NaN; }
  try { const v = input.c0*input.a + input.c1*(input.a**2)/2 + input.c2*(input.a**3)/3 + input.c3*(input.a**4)/4; results["Fa"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Fa"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Fb"])) - (toNumericFormulaValue(results["Fa"])); results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  return results;
}


export function calculateFundamental_theorem_calculus_calculator(input: Fundamental_theorem_calculus_calculatorInput): Fundamental_theorem_calculus_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Fundamental_theorem_calculus_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
