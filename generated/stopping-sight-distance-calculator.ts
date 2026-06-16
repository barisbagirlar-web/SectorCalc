// Auto-generated from stopping-sight-distance-calculator-schema.json
import * as z from 'zod';

export interface Stopping_sight_distance_calculatorInput {
  speed: number;
  reactionTime: number;
  frictionCoeff: number;
  grade: number;
}

export const Stopping_sight_distance_calculatorInputSchema = z.object({
  speed: z.number().default(50),
  reactionTime: z.number().default(2.5),
  frictionCoeff: z.number().default(0.35),
  grade: z.number().default(0),
});

function evaluateAllFormulas(input: Stopping_sight_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.speed * input.reactionTime) / 3.6; results["reactionDist"] = Number.isFinite(v) ? v : 0; } catch { results["reactionDist"] = 0; }
  try { const v = Math.pow(input.speed, 2) / (254 * (input.frictionCoeff + input.grade / 100)); results["brakingDist"] = Number.isFinite(v) ? v : 0; } catch { results["brakingDist"] = 0; }
  try { const v = (results["reactionDist"] ?? 0) + (results["brakingDist"] ?? 0); results["ssd"] = Number.isFinite(v) ? v : 0; } catch { results["ssd"] = 0; }
  return results;
}


export function calculateStopping_sight_distance_calculator(input: Stopping_sight_distance_calculatorInput): Stopping_sight_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ssd"] ?? 0;
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


export interface Stopping_sight_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
