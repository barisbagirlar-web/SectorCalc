// Auto-generated from rolles-theorem-calculator-schema.json
import * as z from 'zod';

export interface Rolles_theorem_calculatorInput {
  a: number;
  b: number;
  fa: number;
  fb: number;
  derivativeCoeff: number;
  derivativeConstant: number;
}

export const Rolles_theorem_calculatorInputSchema = z.object({
  a: z.number().default(0),
  b: z.number().default(2),
  fa: z.number().default(0),
  fb: z.number().default(0),
  derivativeCoeff: z.number().default(2),
  derivativeConstant: z.number().default(0),
});

function evaluateAllFormulas(input: Rolles_theorem_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fa === input.fb; results["checkEqual"] = Number.isFinite(v) ? v : 0; } catch { results["checkEqual"] = 0; }
  try { const v = (0 - input.derivativeConstant) / input.derivativeCoeff; results["c"] = Number.isFinite(v) ? v : 0; } catch { results["c"] = 0; }
  try { const v = (results["c"] ?? 0) > input.a && (results["c"] ?? 0) < input.b; results["cInInterval"] = Number.isFinite(v) ? v : 0; } catch { results["cInInterval"] = 0; }
  return results;
}


export function calculateRolles_theorem_calculator(input: Rolles_theorem_calculatorInput): Rolles_theorem_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["c"] ?? 0;
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


export interface Rolles_theorem_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
