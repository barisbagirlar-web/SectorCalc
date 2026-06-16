// Auto-generated from protein-shake-calculator-schema.json
import * as z from 'zod';

export interface Protein_shake_calculatorInput {
  scoopWeight: number;
  numScoops: number;
  proteinPer100g: number;
  caloriesPer100g: number;
  liquidVolume: number;
}

export const Protein_shake_calculatorInputSchema = z.object({
  scoopWeight: z.number().default(30),
  numScoops: z.number().default(1),
  proteinPer100g: z.number().default(80),
  caloriesPer100g: z.number().default(400),
  liquidVolume: z.number().default(300),
});

function evaluateAllFormulas(input: Protein_shake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scoopWeight * input.numScoops * input.proteinPer100g / 100; results["totalProtein"] = Number.isFinite(v) ? v : 0; } catch { results["totalProtein"] = 0; }
  try { const v = input.scoopWeight * input.numScoops; results["totalPowderWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalPowderWeight"] = 0; }
  try { const v = input.scoopWeight * input.numScoops * input.caloriesPer100g / 100; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.scoopWeight * input.numScoops * input.proteinPer100g / input.liquidVolume; results["proteinPer100ml"] = Number.isFinite(v) ? v : 0; } catch { results["proteinPer100ml"] = 0; }
  return results;
}


export function calculateProtein_shake_calculator(input: Protein_shake_calculatorInput): Protein_shake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalProtein"] ?? 0;
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


export interface Protein_shake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
