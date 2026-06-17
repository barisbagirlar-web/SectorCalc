// Auto-generated from body-recomposition-schema.json
import * as z from 'zod';

export interface Body_recompositionInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityFactor: number;
  goal: number;
}

export const Body_recompositionInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  activityFactor: z.number().default(1.55),
  goal: z.number().default(0),
});

function evaluateAllFormulas(input: Body_recompositionInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.gender==0?10*input.weight+6.25*input.height-5*input.age+5:10*input.weight+6.25*input.height-5*input.age-161)*input.activityFactor*(1+input.goal/100)); results["dailyCalories"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCalories"] = 0; }
  try { const v = input.weight*2.2; results["protein"] = Number.isFinite(v) ? v : 0; } catch { results["protein"] = 0; }
  try { const v = input.weight*0.8; results["fat"] = Number.isFinite(v) ? v : 0; } catch { results["fat"] = 0; }
  try { const v = (((input.gender==0?10*input.weight+6.25*input.height-5*input.age+5:10*input.weight+6.25*input.height-5*input.age-161)*input.activityFactor*(1+input.goal/100)) - (input.weight*2.2*4 + input.weight*0.8*9)) / 4; results["carbs"] = Number.isFinite(v) ? v : 0; } catch { results["carbs"] = 0; }
  return results;
}


export function calculateBody_recomposition(input: Body_recompositionInput): Body_recompositionOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyCalories"] ?? 0;
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


export interface Body_recompositionOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
