// Auto-generated from metabolic-age-calculator-schema.json
import * as z from 'zod';

export interface Metabolic_age_calculatorInput {
  chronologicalAge: number;
  gender: number;
  weightKg: number;
  heightCm: number;
}

export const Metabolic_age_calculatorInputSchema = z.object({
  chronologicalAge: z.number().default(30),
  gender: z.number().default(0),
  weightKg: z.number().default(70),
  heightCm: z.number().default(170),
});

function evaluateAllFormulas(input: Metabolic_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (10 * input.weightKg + 6.25 * input.heightCm - 5 * input.chronologicalAge) + (input.gender === 0 ? 5 : -161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (input.gender === 0 ? 1800 - 5 * input.chronologicalAge : 1600 - 5 * input.chronologicalAge); results["expectedBmr"] = Number.isFinite(v) ? v : 0; } catch { results["expectedBmr"] = 0; }
  try { const v = Math.max(0, input.chronologicalAge - ((results["bmr"] ?? 0) - (results["expectedBmr"] ?? 0)) / 5); results["metabolicAge"] = Number.isFinite(v) ? v : 0; } catch { results["metabolicAge"] = 0; }
  return results;
}


export function calculateMetabolic_age_calculator(input: Metabolic_age_calculatorInput): Metabolic_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["metabolicAge"] ?? 0;
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


export interface Metabolic_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
