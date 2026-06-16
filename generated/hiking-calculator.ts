// Auto-generated from hiking-calculator-schema.json
import * as z from 'zod';

export interface Hiking_calculatorInput {
  distance: number;
  elevationGain: number;
  averageSpeed: number;
  backpackWeight: number;
}

export const Hiking_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  elevationGain: z.number().default(500),
  averageSpeed: z.number().default(5),
  backpackWeight: z.number().default(0),
});

function evaluateAllFormulas(input: Hiking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageSpeed * (1 - 0.005 * input.backpackWeight); results["adjustedSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedSpeed"] = 0; }
  try { const v = input.distance / (results["adjustedSpeed"] ?? 0); results["baseTime"] = Number.isFinite(v) ? v : 0; } catch { results["baseTime"] = 0; }
  try { const v = input.elevationGain / 600; results["ascentTime"] = Number.isFinite(v) ? v : 0; } catch { results["ascentTime"] = 0; }
  try { const v = (results["baseTime"] ?? 0) + (results["ascentTime"] ?? 0); results["totalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  return results;
}


export function calculateHiking_calculator(input: Hiking_calculatorInput): Hiking_calculatorOutput {
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


export interface Hiking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
