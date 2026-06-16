// Auto-generated from body-recomposition-calculator-schema.json
import * as z from 'zod';

export interface Body_recomposition_calculatorInput {
  weight: number;
  bodyFatPercentage: number;
  height: number;
  age: number;
  activityLevel: number;
}

export const Body_recomposition_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  bodyFatPercentage: z.number().default(20),
  height: z.number().default(170),
  age: z.number().default(30),
  activityLevel: z.number().default(1.55),
});

function evaluateAllFormulas(input: Body_recomposition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round((370 + 21.6 * (input.weight * (1 - input.bodyFatPercentage / 100))) * input.activityLevel); results["tdeeKcalPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["tdeeKcalPerDay"] = 0; }
  try { const v = Math.round(2.2 * input.weight); results["proteinGramsPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["proteinGramsPerDay"] = 0; }
  try { const v = Math.round(1 * input.weight); results["fatGramsPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["fatGramsPerDay"] = 0; }
  return results;
}


export function calculateBody_recomposition_calculator(input: Body_recomposition_calculatorInput): Body_recomposition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tdeeKcalPerDay"] ?? 0;
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


export interface Body_recomposition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
