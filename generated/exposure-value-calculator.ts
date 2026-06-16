// Auto-generated from exposure-value-calculator-schema.json
import * as z from 'zod';

export interface Exposure_value_calculatorInput {
  aperture: number;
  shutterSpeed: number;
  iso: number;
  measuredEV: number;
}

export const Exposure_value_calculatorInputSchema = z.object({
  aperture: z.number().default(8),
  shutterSpeed: z.number().default(0.008),
  iso: z.number().default(100),
  measuredEV: z.number().default(12),
});

function evaluateAllFormulas(input: Exposure_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log2((input.aperture * input.aperture) / input.shutterSpeed) + Math.log2(input.iso / 100); results["calculatedEV"] = Number.isFinite(v) ? v : 0; } catch { results["calculatedEV"] = 0; }
  try { const v = input.measuredEV - (results["calculatedEV"] ?? 0); results["difference"] = Number.isFinite(v) ? v : 0; } catch { results["difference"] = 0; }
  return results;
}


export function calculateExposure_value_calculator(input: Exposure_value_calculatorInput): Exposure_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calculatedEV"] ?? 0;
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


export interface Exposure_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
