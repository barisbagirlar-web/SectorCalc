// Auto-generated from soil-volume-calculator-schema.json
import * as z from 'zod';

export interface Soil_volume_calculatorInput {
  length: number;
  width: number;
  depth: number;
  density: number;
  compactionFactor: number;
}

export const Soil_volume_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  depth: z.number().default(0.5),
  density: z.number().default(1.6),
  compactionFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Soil_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.depth * input.compactionFactor; results["soilVolume"] = Number.isFinite(v) ? v : 0; } catch { results["soilVolume"] = 0; }
  try { const v = input.length * input.width * input.depth * input.compactionFactor * 1.30795; results["soilVolumeYards"] = Number.isFinite(v) ? v : 0; } catch { results["soilVolumeYards"] = 0; }
  try { const v = input.length * input.width * input.depth * input.compactionFactor * input.density; results["soilWeight"] = Number.isFinite(v) ? v : 0; } catch { results["soilWeight"] = 0; }
  return results;
}


export function calculateSoil_volume_calculator(input: Soil_volume_calculatorInput): Soil_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["soilVolume"] ?? 0;
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


export interface Soil_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
