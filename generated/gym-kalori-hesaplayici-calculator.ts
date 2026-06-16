// Auto-generated from gym-kalori-hesaplayici-calculator-schema.json
import * as z from 'zod';

export interface Gym_kalori_hesaplayici_calculatorInput {
  duration: number;
  weight: number;
  met: number;
  intensity: number;
}

export const Gym_kalori_hesaplayici_calculatorInputSchema = z.object({
  duration: z.number().default(30),
  weight: z.number().default(70),
  met: z.number().default(5),
  intensity: z.number().default(1),
});

function evaluateAllFormulas(input: Gym_kalori_hesaplayici_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * input.weight * (input.duration / 60) * input.intensity; results["toplamKalori"] = Number.isFinite(v) ? v : 0; } catch { results["toplamKalori"] = 0; }
  try { const v = input.met * input.weight * input.intensity / 60; results["dakikaKalori"] = Number.isFinite(v) ? v : 0; } catch { results["dakikaKalori"] = 0; }
  try { const v = input.met * input.weight * (input.duration / 60) * input.intensity / 9; results["yagYakimi"] = Number.isFinite(v) ? v : 0; } catch { results["yagYakimi"] = 0; }
  return results;
}


export function calculateGym_kalori_hesaplayici_calculator(input: Gym_kalori_hesaplayici_calculatorInput): Gym_kalori_hesaplayici_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["toplamKalori"] ?? 0;
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


export interface Gym_kalori_hesaplayici_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
