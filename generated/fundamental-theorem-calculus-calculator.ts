// Auto-generated from fundamental-theorem-calculus-calculator-schema.json
import * as z from 'zod';

export interface Fundamental_theorem_calculus_calculatorInput {
  a: number;
  b: number;
  c0: number;
  c1: number;
  c2: number;
  c3: number;
}

export const Fundamental_theorem_calculus_calculatorInputSchema = z.object({
  a: z.number().default(0),
  b: z.number().default(1),
  c0: z.number().default(0),
  c1: z.number().default(0),
  c2: z.number().default(0),
  c3: z.number().default(0),
});

function evaluateAllFormulas(input: Fundamental_theorem_calculus_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.c0*input.b + input.c1*(input.b**2)/2 + input.c2*(input.b**3)/3 + input.c3*(input.b**4)/4; results["Fb"] = Number.isFinite(v) ? v : 0; } catch { results["Fb"] = 0; }
  try { const v = input.c0*input.a + input.c1*(input.a**2)/2 + input.c2*(input.a**3)/3 + input.c3*(input.a**4)/4; results["Fa"] = Number.isFinite(v) ? v : 0; } catch { results["Fa"] = 0; }
  try { const v = (results["Fb"] ?? 0) - (results["Fa"] ?? 0); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  results["F_b____c_b___c_b__2___c_b__3___c_b__4___"] = 0;
  results["F_a____c_a___c_a__2___c_a__3___c_a__4___"] = 0;
  results["__a_b_f_x__dx___F_b____F_a______primary_"] = 0;
  return results;
}


export function calculateFundamental_theorem_calculus_calculator(input: Fundamental_theorem_calculus_calculatorInput): Fundamental_theorem_calculus_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Fundamental_theorem_calculus_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
