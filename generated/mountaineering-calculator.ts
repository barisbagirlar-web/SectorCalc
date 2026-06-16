// Auto-generated from mountaineering-calculator-schema.json
import * as z from 'zod';

export interface Mountaineering_calculatorInput {
  distance: number;
  elevationGain: number;
  flatSpeed: number;
  ascentPace: number;
  difficultyMultiplier: number;
  safetyMarginPercent: number;
}

export const Mountaineering_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  elevationGain: z.number().default(800),
  flatSpeed: z.number().default(5),
  ascentPace: z.number().default(600),
  difficultyMultiplier: z.number().default(1),
  safetyMarginPercent: z.number().default(10),
});

function evaluateAllFormulas(input: Mountaineering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.flatSpeed; results["flatTime"] = Number.isFinite(v) ? v : 0; } catch { results["flatTime"] = 0; }
  try { const v = input.elevationGain / input.ascentPace; results["ascentTime"] = Number.isFinite(v) ? v : 0; } catch { results["ascentTime"] = 0; }
  try { const v = (results["flatTime"] ?? 0) + (results["ascentTime"] ?? 0); results["baseTime"] = Number.isFinite(v) ? v : 0; } catch { results["baseTime"] = 0; }
  try { const v = (results["baseTime"] ?? 0) * input.difficultyMultiplier * (1 + input.safetyMarginPercent / 100); results["totalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  return results;
}


export function calculateMountaineering_calculator(input: Mountaineering_calculatorInput): Mountaineering_calculatorOutput {
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


export interface Mountaineering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
