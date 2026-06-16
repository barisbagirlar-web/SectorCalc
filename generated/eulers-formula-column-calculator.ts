// Auto-generated from eulers-formula-column-calculator-schema.json
import * as z from 'zod';

export interface Eulers_formula_column_calculatorInput {
  E: number;
  I: number;
  K: number;
  L: number;
  A: number;
}

export const Eulers_formula_column_calculatorInputSchema = z.object({
  E: z.number().default(200000),
  I: z.number().default(1000000),
  K: z.number().default(1),
  L: z.number().default(3000),
  A: z.number().default(1000),
});

function evaluateAllFormulas(input: Eulers_formula_column_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.I / input.A); results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = (Math.PI**2 * input.E * input.I) / Math.pow((input.K * input.L), 2); results["P_cr"] = Number.isFinite(v) ? v : 0; } catch { results["P_cr"] = 0; }
  try { const v = (results["P_cr"] ?? 0) / input.A; results["criticalStress"] = Number.isFinite(v) ? v : 0; } catch { results["criticalStress"] = 0; }
  try { const v = (input.K * input.L) / (results["r"] ?? 0); results["slenderness"] = Number.isFinite(v) ? v : 0; } catch { results["slenderness"] = 0; }
  return results;
}


export function calculateEulers_formula_column_calculator(input: Eulers_formula_column_calculatorInput): Eulers_formula_column_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["P_cr"] ?? 0;
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


export interface Eulers_formula_column_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
