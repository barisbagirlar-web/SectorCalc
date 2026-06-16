// Auto-generated from devine-formula-schema.json
import * as z from 'zod';

export interface Devine_formulaInput {
  height: number;
  gender: number;
}

export const Devine_formulaInputSchema = z.object({
  height: z.number().default(66),
  gender: z.number().default(1),
});

function evaluateAllFormulas(input: Devine_formulaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender == 1 ? 50 + 2.3 * (input.height - 60) : 45.5 + 2.3 * (input.height - 60); results["ibw"] = Number.isFinite(v) ? v : 0; } catch { results["ibw"] = 0; }
  return results;
}


export function calculateDevine_formula(input: Devine_formulaInput): Devine_formulaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ibw"] ?? 0;
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


export interface Devine_formulaOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
