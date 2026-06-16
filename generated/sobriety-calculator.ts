// Auto-generated from sobriety-calculator-schema.json
import * as z from 'zod';

export interface Sobriety_calculatorInput {
  drinks: number;
  alcoholPerDrink: number;
  weightKg: number;
  genderCode: number;
  timeHours: number;
}

export const Sobriety_calculatorInputSchema = z.object({
  drinks: z.number().default(1),
  alcoholPerDrink: z.number().default(14),
  weightKg: z.number().default(70),
  genderCode: z.number().default(0),
  timeHours: z.number().default(1),
});

function evaluateAllFormulas(input: Sobriety_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.genderCode == 0 ? 0.68 : 0.55; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = input.drinks * input.alcoholPerDrink; results["totalAlcohol"] = Number.isFinite(v) ? v : 0; } catch { results["totalAlcohol"] = 0; }
  try { const v = Math.max(0, (results["totalAlcohol"] ?? 0) / (input.weightKg * (results["r"] ?? 0)) - 0.15 * input.timeHours); results["currentBAC"] = Number.isFinite(v) ? v : 0; } catch { results["currentBAC"] = 0; }
  try { const v = Math.max(0, (results["totalAlcohol"] ?? 0) / (input.weightKg * (results["r"] ?? 0)) / 0.15 - input.timeHours); results["timeToSober"] = Number.isFinite(v) ? v : 0; } catch { results["timeToSober"] = 0; }
  return results;
}


export function calculateSobriety_calculator(input: Sobriety_calculatorInput): Sobriety_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["currentBAC"] ?? 0;
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


export interface Sobriety_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
