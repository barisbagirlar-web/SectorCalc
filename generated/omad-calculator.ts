// Auto-generated from omad-calculator-schema.json
import * as z from 'zod';

export interface Omad_calculatorInput {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export const Omad_calculatorInputSchema = z.object({
  protein: z.number().default(0),
  carbs: z.number().default(0),
  fat: z.number().default(0),
  fiber: z.number().default(0),
});

function evaluateAllFormulas(input: Omad_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.protein * 4 + input.carbs * 4 + input.fat * 9; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.protein * 4; results["proteinCalories"] = Number.isFinite(v) ? v : 0; } catch { results["proteinCalories"] = 0; }
  try { const v = input.carbs * 4; results["carbsCalories"] = Number.isFinite(v) ? v : 0; } catch { results["carbsCalories"] = 0; }
  try { const v = input.fat * 9; results["fatCalories"] = Number.isFinite(v) ? v : 0; } catch { results["fatCalories"] = 0; }
  return results;
}


export function calculateOmad_calculator(input: Omad_calculatorInput): Omad_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCalories"] ?? 0;
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


export interface Omad_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
