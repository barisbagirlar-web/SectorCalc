// Auto-generated from wallpaper-calculator-schema.json
import * as z from 'zod';

export interface Wallpaper_calculatorInput {
  wallWidth: number;
  wallHeight: number;
  rollWidth: number;
  rollLength: number;
  patternRepeat: number;
  wastePercent: number;
}

export const Wallpaper_calculatorInputSchema = z.object({
  wallWidth: z.number().default(5),
  wallHeight: z.number().default(2.5),
  rollWidth: z.number().default(0.53),
  rollLength: z.number().default(10),
  patternRepeat: z.number().default(0),
  wastePercent: z.number().default(10),
});

function evaluateAllFormulas(input: Wallpaper_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallWidth * input.wallHeight; results["wallArea"] = Number.isFinite(v) ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = input.rollLength - (input.patternRepeat > 0 ? (input.rollLength % input.patternRepeat) : 0); results["usableRollLength"] = Number.isFinite(v) ? v : 0; } catch { results["usableRollLength"] = 0; }
  try { const v = Math.floor((results["usableRollLength"] ?? 0) / (input.wallHeight + input.patternRepeat)); results["stripsPerRoll"] = Number.isFinite(v) ? v : 0; } catch { results["stripsPerRoll"] = 0; }
  try { const v = Math.ceil(input.wallWidth / input.rollWidth); results["totalStrips"] = Number.isFinite(v) ? v : 0; } catch { results["totalStrips"] = 0; }
  try { const v = Math.ceil((results["totalStrips"] ?? 0) / (results["stripsPerRoll"] ?? 0)); results["rollsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["rollsNeeded"] = 0; }
  try { const v = input.wallWidth * input.wallHeight; results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (results["rollsNeeded"] ?? 0) * input.rollWidth * input.rollLength; results["totalRollArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalRollArea"] = 0; }
  try { const v = (results["totalRollArea"] ?? 0) - (results["totalArea"] ?? 0); results["wasteArea"] = Number.isFinite(v) ? v : 0; } catch { results["wasteArea"] = 0; }
  try { const v = ((results["wasteArea"] ?? 0) / (results["totalRollArea"] ?? 0)) * 100; results["wastePercentActual"] = Number.isFinite(v) ? v : 0; } catch { results["wastePercentActual"] = 0; }
  return results;
}


export function calculateWallpaper_calculator(input: Wallpaper_calculatorInput): Wallpaper_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rollsNeeded"] ?? 0;
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


export interface Wallpaper_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
