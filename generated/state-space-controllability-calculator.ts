// Auto-generated from state-space-controllability-calculator-schema.json
import * as z from 'zod';

export interface State_space_controllability_calculatorInput {
  a11: number;
  a12: number;
  a21: number;
  a22: number;
  b1: number;
  b2: number;
}

export const State_space_controllability_calculatorInputSchema = z.object({
  a11: z.number().default(0),
  a12: z.number().default(1),
  a21: z.number().default(-2),
  a22: z.number().default(-3),
  b1: z.number().default(0),
  b2: z.number().default(1),
});

function evaluateAllFormulas(input: State_space_controllability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.b1; results["c11"] = Number.isFinite(v) ? v : 0; } catch { results["c11"] = 0; }
  try { const v = input.a11 * input.b1 + input.a12 * input.b2; results["c12"] = Number.isFinite(v) ? v : 0; } catch { results["c12"] = 0; }
  try { const v = input.b2; results["c21"] = Number.isFinite(v) ? v : 0; } catch { results["c21"] = 0; }
  try { const v = input.a21 * input.b1 + input.a22 * input.b2; results["c22"] = Number.isFinite(v) ? v : 0; } catch { results["c22"] = 0; }
  try { const v = (results["c11"] ?? 0) * (results["c22"] ?? 0) - (results["c12"] ?? 0) * (results["c21"] ?? 0); results["det"] = Number.isFinite(v) ? v : 0; } catch { results["det"] = 0; }
  return results;
}


export function calculateState_space_controllability_calculator(input: State_space_controllability_calculatorInput): State_space_controllability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["det"] ?? 0;
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


export interface State_space_controllability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
