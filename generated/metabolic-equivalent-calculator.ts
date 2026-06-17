// Auto-generated from metabolic-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Metabolic_equivalent_calculatorInput {
  weight: number;
  duration_hours: number;
  duration_minutes: number;
  met: number;
}

export const Metabolic_equivalent_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration_hours: z.number().default(0),
  duration_minutes: z.number().default(30),
  met: z.number().default(5),
});

function evaluateAllFormulas(input: Metabolic_equivalent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * input.weight * (input.duration_hours + input.duration_minutes/60); results["caloriesBurned"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = input.met * (input.duration_hours*60 + input.duration_minutes); results["metMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["metMinutes"] = 0; }
  try { const v = (input.met * 3.5 * input.weight * (input.duration_hours*60 + input.duration_minutes)) / 1000; results["oxygenConsumed"] = Number.isFinite(v) ? v : 0; } catch { results["oxygenConsumed"] = 0; }
  return results;
}


export function calculateMetabolic_equivalent_calculator(input: Metabolic_equivalent_calculatorInput): Metabolic_equivalent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["caloriesBurned"] ?? 0;
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


export interface Metabolic_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
