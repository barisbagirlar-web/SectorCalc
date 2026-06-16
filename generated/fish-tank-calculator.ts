// Auto-generated from fish-tank-calculator-schema.json
import * as z from 'zod';

export interface Fish_tank_calculatorInput {
  tankLength: number;
  tankWidth: number;
  waterDepth: number;
  fishLength: number;
  conditionFactor: number;
  stockingDensity: number;
  safetyFactor: number;
}

export const Fish_tank_calculatorInputSchema = z.object({
  tankLength: z.number().default(2),
  tankWidth: z.number().default(1),
  waterDepth: z.number().default(0.8),
  fishLength: z.number().default(10),
  conditionFactor: z.number().default(0.02),
  stockingDensity: z.number().default(10),
  safetyFactor: z.number().default(0.8),
});

function evaluateAllFormulas(input: Fish_tank_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tankLength * input.tankWidth * input.waterDepth; results["waterVolume"] = Number.isFinite(v) ? v : 0; } catch { results["waterVolume"] = 0; }
  try { const v = (results["waterVolume"] ?? 0) * 1000; results["waterWeight"] = Number.isFinite(v) ? v : 0; } catch { results["waterWeight"] = 0; }
  try { const v = input.conditionFactor * Math.pow(input.fishLength, 3) / 1000; results["singleFishWeightKg"] = Number.isFinite(v) ? v : 0; } catch { results["singleFishWeightKg"] = 0; }
  try { const v = input.stockingDensity * (results["waterVolume"] ?? 0); results["maxBiomass"] = Number.isFinite(v) ? v : 0; } catch { results["maxBiomass"] = 0; }
  try { const v = Math.floor(input.safetyFactor * (results["maxBiomass"] ?? 0) / (results["singleFishWeightKg"] ?? 0)); results["recommendedFish"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedFish"] = 0; }
  return results;
}


export function calculateFish_tank_calculator(input: Fish_tank_calculatorInput): Fish_tank_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommendedFish"] ?? 0;
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


export interface Fish_tank_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
