// Auto-generated from vitamin-calculator-schema.json
import * as z from 'zod';

export interface Vitamin_calculatorInput {
  rda: number;
  food1Servings: number;
  food1VitPerServing: number;
  food2Servings: number;
  food2VitPerServing: number;
  food3Servings: number;
  food3VitPerServing: number;
}

export const Vitamin_calculatorInputSchema = z.object({
  rda: z.number().default(90),
  food1Servings: z.number().default(1),
  food1VitPerServing: z.number().default(30),
  food2Servings: z.number().default(1),
  food2VitPerServing: z.number().default(20),
  food3Servings: z.number().default(1),
  food3VitPerServing: z.number().default(10),
});

function evaluateAllFormulas(input: Vitamin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.food1Servings * input.food1VitPerServing + input.food2Servings * input.food2VitPerServing + input.food3Servings * input.food3VitPerServing; results["totalVitaminIntake"] = Number.isFinite(v) ? v : 0; } catch { results["totalVitaminIntake"] = 0; }
  try { const v = ((results["totalVitaminIntake"] ?? 0) / input.rda) * 100; results["percentRDA"] = Number.isFinite(v) ? v : 0; } catch { results["percentRDA"] = 0; }
  try { const v = input.rda - (results["totalVitaminIntake"] ?? 0); results["shortfallValue"] = Number.isFinite(v) ? v : 0; } catch { results["shortfallValue"] = 0; }
  return results;
}


export function calculateVitamin_calculator(input: Vitamin_calculatorInput): Vitamin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalVitaminIntake"] ?? 0;
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


export interface Vitamin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
