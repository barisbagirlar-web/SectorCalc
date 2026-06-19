// Auto-generated from equilibrium-constant-calculator-schema.json
import * as z from 'zod';

export interface Equilibrium_constant_calculatorInput {
  c_A: number;
  c_B: number;
  c_C: number;
  c_D: number;
  a: number;
  b: number;
  c: number;
  d: number;
  dataConfidence?: number;
}

export const Equilibrium_constant_calculatorInputSchema = z.object({
  c_A: z.number().default(0.1),
  c_B: z.number().default(0.1),
  c_C: z.number().default(0.1),
  c_D: z.number().default(0.1),
  a: z.number().default(1),
  b: z.number().default(1),
  c: z.number().default(1),
  d: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Equilibrium_constant_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.c_A * input.c_B * input.c_C * input.c_D; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.c_A * input.c_B * input.c_C * input.c_D * (input.a * input.b * input.c * input.d); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.a * input.b * input.c * input.d; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEquilibrium_constant_calculator(input: Equilibrium_constant_calculatorInput): Equilibrium_constant_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Equilibrium_constant_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
