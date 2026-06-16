// Auto-generated from crop-factor-calculator-schema.json
import * as z from 'zod';

export interface Crop_factor_calculatorInput {
  sensorWidth: number;
  sensorHeight: number;
  fullFrameWidth: number;
  fullFrameHeight: number;
}

export const Crop_factor_calculatorInputSchema = z.object({
  sensorWidth: z.number().default(22.3),
  sensorHeight: z.number().default(14.9),
  fullFrameWidth: z.number().default(36),
  fullFrameHeight: z.number().default(24),
});

function evaluateAllFormulas(input: Crop_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.sensorWidth**2 + input.sensorHeight**2); results["sensorDiagonal"] = Number.isFinite(v) ? v : 0; } catch { results["sensorDiagonal"] = 0; }
  try { const v = Math.sqrt(input.fullFrameWidth**2 + input.fullFrameHeight**2); results["fullFrameDiagonal"] = Number.isFinite(v) ? v : 0; } catch { results["fullFrameDiagonal"] = 0; }
  try { const v = (results["fullFrameDiagonal"] ?? 0) / (results["sensorDiagonal"] ?? 0); results["cropFactor"] = Number.isFinite(v) ? v : 0; } catch { results["cropFactor"] = 0; }
  try { const v = (input.fullFrameWidth * input.fullFrameHeight) / (input.sensorWidth * input.sensorHeight); results["areaRatio"] = Number.isFinite(v) ? v : 0; } catch { results["areaRatio"] = 0; }
  return results;
}


export function calculateCrop_factor_calculator(input: Crop_factor_calculatorInput): Crop_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cropFactor"] ?? 0;
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


export interface Crop_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
