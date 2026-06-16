// Auto-generated from hiking-time-calculator-schema.json
import * as z from 'zod';

export interface Hiking_time_calculatorInput {
  distance: number;
  elevationGain: number;
  pace: number;
  terrainFactor: number;
}

export const Hiking_time_calculatorInputSchema = z.object({
  distance: z.number().default(5),
  elevationGain: z.number().default(500),
  pace: z.number().default(12),
  terrainFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Hiking_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.pace * input.terrainFactor + input.elevationGain * 0.1 * input.terrainFactor; results["totalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  try { const v = input.distance * input.pace * input.terrainFactor; results["walkingTime"] = Number.isFinite(v) ? v : 0; } catch { results["walkingTime"] = 0; }
  try { const v = input.elevationGain * 0.1 * input.terrainFactor; results["elevationTime"] = Number.isFinite(v) ? v : 0; } catch { results["elevationTime"] = 0; }
  return results;
}


export function calculateHiking_time_calculator(input: Hiking_time_calculatorInput): Hiking_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTime"] ?? 0;
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


export interface Hiking_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
