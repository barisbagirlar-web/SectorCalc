// Auto-generated from protein-intake-calculator-schema.json
import * as z from 'zod';

export interface Protein_intake_calculatorInput {
  bodyWeightKg: number;
  baseProtein: number;
  activityFactor: number;
  goalFactor: number;
}

export const Protein_intake_calculatorInputSchema = z.object({
  bodyWeightKg: z.number().default(70),
  baseProtein: z.number().default(0.8),
  activityFactor: z.number().default(1),
  goalFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Protein_intake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyWeightKg * input.baseProtein * input.activityFactor * input.goalFactor; results["dailyProteinGrams"] = Number.isFinite(v) ? v : 0; } catch { results["dailyProteinGrams"] = 0; }
  try { const v = (results["dailyProteinGrams"] ?? 0) * 4; results["proteinCalories"] = Number.isFinite(v) ? v : 0; } catch { results["proteinCalories"] = 0; }
  return results;
}


export function calculateProtein_intake_calculator(input: Protein_intake_calculatorInput): Protein_intake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyProteinGrams"] ?? 0;
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


export interface Protein_intake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
