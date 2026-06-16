// Auto-generated from pet-life-expectancy-calculator-schema.json
import * as z from 'zod';

export interface Pet_life_expectancy_calculatorInput {
  baseLifespan: number;
  weight: number;
  idealWeight: number;
  activityLevel: number;
  dietQuality: number;
  vetVisits: number;
  sterilized: number;
}

export const Pet_life_expectancy_calculatorInputSchema = z.object({
  baseLifespan: z.number().default(12),
  weight: z.number().default(10),
  idealWeight: z.number().default(10),
  activityLevel: z.number().default(5),
  dietQuality: z.number().default(7),
  vetVisits: z.number().default(2),
  sterilized: z.number().default(1),
});

function evaluateAllFormulas(input: Pet_life_expectancy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - 0.02 * Math.abs(input.weight - input.idealWeight); results["weightMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["weightMultiplier"] = 0; }
  try { const v = 0.8 + (input.activityLevel / 10) * 0.2; results["activityMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["activityMultiplier"] = 0; }
  try { const v = 0.7 + (input.dietQuality / 10) * 0.3; results["dietMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["dietMultiplier"] = 0; }
  try { const v = Math.min(1, 0.9 + input.vetVisits * 0.025); results["vetMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["vetMultiplier"] = 0; }
  try { const v = 1 + 0.1 * input.sterilized; results["sterilizationMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["sterilizationMultiplier"] = 0; }
  try { const v = input.baseLifespan * (results["weightMultiplier"] ?? 0) * (results["activityMultiplier"] ?? 0) * (results["dietMultiplier"] ?? 0) * (results["vetMultiplier"] ?? 0) * (results["sterilizationMultiplier"] ?? 0); results["lifeExpectancy"] = Number.isFinite(v) ? v : 0; } catch { results["lifeExpectancy"] = 0; }
  return results;
}


export function calculatePet_life_expectancy_calculator(input: Pet_life_expectancy_calculatorInput): Pet_life_expectancy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["lifeExpectancy"] ?? 0;
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


export interface Pet_life_expectancy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
