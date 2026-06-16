// Auto-generated from vegetarian-calculator-schema.json
import * as z from 'zod';

export interface Vegetarian_calculatorInput {
  years: number;
  meatGramsPerDay: number;
  daysVegetarianPerWeek: number;
  waterPerKgMeat: number;
  co2PerKgMeat: number;
  animalsPerKgMeat: number;
}

export const Vegetarian_calculatorInputSchema = z.object({
  years: z.number().default(1),
  meatGramsPerDay: z.number().default(200),
  daysVegetarianPerWeek: z.number().default(7),
  waterPerKgMeat: z.number().default(15000),
  co2PerKgMeat: z.number().default(27),
  animalsPerKgMeat: z.number().default(0.005),
});

function evaluateAllFormulas(input: Vegetarian_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.meatGramsPerDay/1000) * (input.daysVegetarianPerWeek/7) * input.years * 365) * input.animalsPerKgMeat; results["animalsSaved"] = Number.isFinite(v) ? v : 0; } catch { results["animalsSaved"] = 0; }
  try { const v = ((input.meatGramsPerDay/1000) * (input.daysVegetarianPerWeek/7) * input.years * 365) * input.waterPerKgMeat; results["waterSaved"] = Number.isFinite(v) ? v : 0; } catch { results["waterSaved"] = 0; }
  try { const v = ((input.meatGramsPerDay/1000) * (input.daysVegetarianPerWeek/7) * input.years * 365) * input.co2PerKgMeat; results["co2Saved"] = Number.isFinite(v) ? v : 0; } catch { results["co2Saved"] = 0; }
  return results;
}


export function calculateVegetarian_calculator(input: Vegetarian_calculatorInput): Vegetarian_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["animalsSaved"] ?? 0;
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


export interface Vegetarian_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
