// Auto-generated from strength-standard-calculator-schema.json
import * as z from 'zod';

export interface Strength_standard_calculatorInput {
  weight: number;
  reps: number;
  bodyWeight: number;
  gender: number;
}

export const Strength_standard_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(5),
  bodyWeight: z.number().default(80),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Strength_standard_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps/30); results["oneRepMax"] = Number.isFinite(v) ? v : 0; } catch { results["oneRepMax"] = 0; }
  try { const v = (results["oneRepMax"] ?? 0) / input.bodyWeight; results["strengthRatio"] = Number.isFinite(v) ? v : 0; } catch { results["strengthRatio"] = 0; }
  try { const v = (input.gender == 0) ? ((results["strengthRatio"] ?? 0) < 1.0 ? 0 : (results["strengthRatio"] ?? 0) < 1.5 ? 1 : (results["strengthRatio"] ?? 0) < 2.0 ? 2 : (results["strengthRatio"] ?? 0) < 2.5 ? 3 : 4) : ((results["strengthRatio"] ?? 0) < 0.8 ? 0 : (results["strengthRatio"] ?? 0) < 1.2 ? 1 : (results["strengthRatio"] ?? 0) < 1.6 ? 2 : (results["strengthRatio"] ?? 0) < 2.0 ? 3 : 4); results["strengthLevel"] = Number.isFinite(v) ? v : 0; } catch { results["strengthLevel"] = 0; }
  return results;
}


export function calculateStrength_standard_calculator(input: Strength_standard_calculatorInput): Strength_standard_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["oneRepMax"] ?? 0;
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


export interface Strength_standard_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
