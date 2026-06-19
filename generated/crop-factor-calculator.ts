// Auto-generated from crop-factor-calculator-schema.json
import * as z from 'zod';

export interface Crop_factor_calculatorInput {
  sensorWidth: number;
  sensorHeight: number;
  fullFrameWidth: number;
  fullFrameHeight: number;
  dataConfidence?: number;
}

export const Crop_factor_calculatorInputSchema = z.object({
  sensorWidth: z.number().default(22.3),
  sensorHeight: z.number().default(14.9),
  fullFrameWidth: z.number().default(36),
  fullFrameHeight: z.number().default(24),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Crop_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fullFrameWidth * input.fullFrameHeight) / (input.sensorWidth * input.sensorHeight); results["areaRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["areaRatio"] = 0; }
  try { const v = (input.fullFrameWidth * input.fullFrameHeight) / (input.sensorWidth * input.sensorHeight); results["areaRatio_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["areaRatio_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCrop_factor_calculator(input: Crop_factor_calculatorInput): Crop_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["areaRatio_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
