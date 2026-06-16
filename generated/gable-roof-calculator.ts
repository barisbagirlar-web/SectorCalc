// Auto-generated from gable-roof-calculator-schema.json
import * as z from 'zod';

export interface Gable_roof_calculatorInput {
  buildingWidth: number;
  buildingLength: number;
  roofPitch: number;
  overhang: number;
  rafterSpacing: number;
  wasteFactor: number;
}

export const Gable_roof_calculatorInputSchema = z.object({
  buildingWidth: z.number().default(10),
  buildingLength: z.number().default(12),
  roofPitch: z.number().default(30),
  overhang: z.number().default(0.5),
  rafterSpacing: z.number().default(0.6),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Gable_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * input.buildingLength * ((input.buildingWidth / 2 + input.overhang) / Math.cos(input.roofPitch * Math.PI / 180)) * (1 + input.wasteFactor / 100); results["totalRoofAreaIncludingWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalRoofAreaIncludingWaste"] = 0; }
  try { const v = (input.buildingWidth / 2 + input.overhang) / Math.cos(input.roofPitch * Math.PI / 180); results["rafterLength"] = Number.isFinite(v) ? v : 0; } catch { results["rafterLength"] = 0; }
  try { const v = input.buildingLength; results["ridgeLength"] = Number.isFinite(v) ? v : 0; } catch { results["ridgeLength"] = 0; }
  try { const v = 2 * input.buildingLength * ((input.buildingWidth / 2 + input.overhang) / Math.cos(input.roofPitch * Math.PI / 180)); results["roofSurfaceArea"] = Number.isFinite(v) ? v : 0; } catch { results["roofSurfaceArea"] = 0; }
  try { const v = 2 * (Math.ceil(input.buildingLength / input.rafterSpacing) + 1); results["totalRafters"] = Number.isFinite(v) ? v : 0; } catch { results["totalRafters"] = 0; }
  return results;
}


export function calculateGable_roof_calculator(input: Gable_roof_calculatorInput): Gable_roof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRoofAreaIncludingWaste"] ?? 0;
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


export interface Gable_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
