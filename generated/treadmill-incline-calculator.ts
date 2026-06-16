// Auto-generated from treadmill-incline-calculator-schema.json
import * as z from 'zod';

export interface Treadmill_incline_calculatorInput {
  distance: number;
  inclinePercent: number;
  weight: number;
  speed: number;
  time: number;
}

export const Treadmill_incline_calculatorInputSchema = z.object({
  distance: z.number().default(1),
  inclinePercent: z.number().default(0),
  weight: z.number().default(150),
  speed: z.number().default(3),
  time: z.number().default(30),
});

function evaluateAllFormulas(input: Treadmill_incline_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * 5280 * (input.inclinePercent / 100); results["elevationGain"] = Number.isFinite(v) ? v : 0; } catch { results["elevationGain"] = 0; }
  try { const v = ( (0.2 * (input.speed * 26.8224) + 0.9 * (input.speed * 26.8224) * (input.inclinePercent / 100) + 3.5) * (input.weight / 2.20462) * input.time * 5 ) / 1000; results["caloriesBurned"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = (( (0.2 * (input.speed * 26.8224) + 0.9 * (input.speed * 26.8224) * (input.inclinePercent / 100) + 3.5) * (input.weight / 2.20462) * input.time * 5 ) / 1000) / (((0.2 * (input.speed * 26.8224) + 3.5) * (input.weight / 2.20462) * 5 ) / 1000 * (60 / input.speed)); results["equivalentFlatDistance"] = Number.isFinite(v) ? v : 0; } catch { results["equivalentFlatDistance"] = 0; }
  return results;
}


export function calculateTreadmill_incline_calculator(input: Treadmill_incline_calculatorInput): Treadmill_incline_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["elevationGain"] ?? 0;
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


export interface Treadmill_incline_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
