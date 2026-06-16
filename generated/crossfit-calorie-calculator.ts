// Auto-generated from crossfit-calorie-calculator-schema.json
import * as z from 'zod';

export interface Crossfit_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  intensity_modifier: number;
}

export const Crossfit_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  met: z.number().default(8),
  intensity_modifier: z.number().default(100),
});

function evaluateAllFormulas(input: Crossfit_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * input.weight * (input.duration / 60) * (input.intensity_modifier / 100); results["total_calories"] = Number.isFinite(v) ? v : 0; } catch { results["total_calories"] = 0; }
  try { const v = input.met * input.weight * (input.duration / 60); results["unmodified_calories"] = Number.isFinite(v) ? v : 0; } catch { results["unmodified_calories"] = 0; }
  try { const v = input.met * input.weight / 60 * (input.intensity_modifier / 100); results["calories_per_minute"] = Number.isFinite(v) ? v : 0; } catch { results["calories_per_minute"] = 0; }
  return results;
}


export function calculateCrossfit_calorie_calculator(input: Crossfit_calorie_calculatorInput): Crossfit_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_calories"] ?? 0;
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


export interface Crossfit_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
