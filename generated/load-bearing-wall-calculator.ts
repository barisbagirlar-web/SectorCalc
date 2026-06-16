// Auto-generated from load-bearing-wall-calculator-schema.json
import * as z from 'zod';

export interface Load_bearing_wall_calculatorInput {
  wallThickness: number;
  wallLength: number;
  wallHeight: number;
  compressiveStrength: number;
  safetyFactor: number;
}

export const Load_bearing_wall_calculatorInputSchema = z.object({
  wallThickness: z.number().default(200),
  wallLength: z.number().default(1),
  wallHeight: z.number().default(3),
  compressiveStrength: z.number().default(20),
  safetyFactor: z.number().default(2),
});

function evaluateAllFormulas(input: Load_bearing_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallThickness / 1000 * input.wallLength; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = input.wallHeight * Math.sqrt(12) * 1000 / input.wallThickness; results["slendernessRatio"] = Number.isFinite(v) ? v : 0; } catch { results["slendernessRatio"] = 0; }
  try { const v = input.compressiveStrength / input.safetyFactor; results["axialStress"] = Number.isFinite(v) ? v : 0; } catch { results["axialStress"] = 0; }
  try { const v = (results["area"] ?? 0) * input.compressiveStrength * 1000 / input.safetyFactor; results["maxLoad"] = Number.isFinite(v) ? v : 0; } catch { results["maxLoad"] = 0; }
  return results;
}


export function calculateLoad_bearing_wall_calculator(input: Load_bearing_wall_calculatorInput): Load_bearing_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxLoad"] ?? 0;
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


export interface Load_bearing_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
