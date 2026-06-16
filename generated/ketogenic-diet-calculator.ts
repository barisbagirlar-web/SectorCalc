// Auto-generated from ketogenic-diet-calculator-schema.json
import * as z from 'zod';

export interface Ketogenic_diet_calculatorInput {
  totalCalories: number;
  fatPercentage: number;
  proteinPercentage: number;
  carbPercentage: number;
}

export const Ketogenic_diet_calculatorInputSchema = z.object({
  totalCalories: z.number().default(2000),
  fatPercentage: z.number().default(70),
  proteinPercentage: z.number().default(20),
  carbPercentage: z.number().default(10),
});

function evaluateAllFormulas(input: Ketogenic_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalCalories * input.fatPercentage / 100) / 9; results["fatGrams"] = Number.isFinite(v) ? v : 0; } catch { results["fatGrams"] = 0; }
  try { const v = (input.totalCalories * input.proteinPercentage / 100) / 4; results["proteinGrams"] = Number.isFinite(v) ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = (input.totalCalories * input.carbPercentage / 100) / 4; results["carbGrams"] = Number.isFinite(v) ? v : 0; } catch { results["carbGrams"] = 0; }
  return results;
}


export function calculateKetogenic_diet_calculator(input: Ketogenic_diet_calculatorInput): Ketogenic_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fatGrams"] ?? 0;
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


export interface Ketogenic_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
