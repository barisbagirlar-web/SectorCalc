// Auto-generated from met-calculator-schema.json
import * as z from 'zod';

export interface Met_calculatorInput {
  met: number;
  weight: number;
  duration: number;
  caloriesPerLiterO2: number;
}

export const Met_calculatorInputSchema = z.object({
  met: z.number().default(8),
  weight: z.number().default(70),
  duration: z.number().default(30),
  caloriesPerLiterO2: z.number().default(5),
});

function evaluateAllFormulas(input: Met_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * 3.5 * input.weight * (input.caloriesPerLiterO2 / 1000) * input.duration; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.met * 3.5 * input.weight * (input.caloriesPerLiterO2 / 1000); results["caloriesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = input.met * 3.5; results["vo2"] = Number.isFinite(v) ? v : 0; } catch { results["vo2"] = 0; }
  try { const v = input.met * (input.duration / 60); results["metHours"] = Number.isFinite(v) ? v : 0; } catch { results["metHours"] = 0; }
  return results;
}


export function calculateMet_calculator(input: Met_calculatorInput): Met_calculatorOutput {
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


export interface Met_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
