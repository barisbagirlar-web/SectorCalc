// Auto-generated from aquarium-volume-calculator-schema.json
import * as z from 'zod';

export interface Aquarium_volume_calculatorInput {
  length: number;
  width: number;
  height: number;
  waterFillDepth: number;
  substrateDepth: number;
  glassThickness: number;
}

export const Aquarium_volume_calculatorInputSchema = z.object({
  length: z.number().default(60),
  width: z.number().default(30),
  height: z.number().default(36),
  waterFillDepth: z.number().default(30),
  substrateDepth: z.number().default(5),
  glassThickness: z.number().default(5),
});

function evaluateAllFormulas(input: Aquarium_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length - 2 * (input.glassThickness / 10); results["interiorLength"] = Number.isFinite(v) ? v : 0; } catch { results["interiorLength"] = 0; }
  try { const v = input.width - 2 * (input.glassThickness / 10); results["interiorWidth"] = Number.isFinite(v) ? v : 0; } catch { results["interiorWidth"] = 0; }
  try { const v = input.waterFillDepth - input.substrateDepth; results["effectiveWaterDepth"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveWaterDepth"] = 0; }
  try { const v = (results["interiorLength"] ?? 0) * (results["interiorWidth"] ?? 0) * (results["effectiveWaterDepth"] ?? 0); results["volume_cm3"] = Number.isFinite(v) ? v : 0; } catch { results["volume_cm3"] = 0; }
  try { const v = (results["volume_cm3"] ?? 0) / 1000; results["waterVolume_L"] = Number.isFinite(v) ? v : 0; } catch { results["waterVolume_L"] = 0; }
  try { const v = (results["waterVolume_L"] ?? 0) * 0.264172; results["waterVolume_gal"] = Number.isFinite(v) ? v : 0; } catch { results["waterVolume_gal"] = 0; }
  return results;
}


export function calculateAquarium_volume_calculator(input: Aquarium_volume_calculatorInput): Aquarium_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["waterVolume_L"] ?? 0;
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


export interface Aquarium_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
