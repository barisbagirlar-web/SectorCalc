// Auto-generated from noise-exposure-calculator-schema.json
import * as z from 'zod';

export interface Noise_exposure_calculatorInput {
  noiseLevel: number;
  exposureTime: number;
  exchangeRate: number;
  criterionLevel: number;
  thresholdLevel: number;
}

export const Noise_exposure_calculatorInputSchema = z.object({
  noiseLevel: z.number().default(90),
  exposureTime: z.number().default(8),
  exchangeRate: z.number().default(3),
  criterionLevel: z.number().default(85),
  thresholdLevel: z.number().default(0),
});

function evaluateAllFormulas(input: Noise_exposure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.noiseLevel < input.thresholdLevel ? 0 : (input.exposureTime / (8 / Math.pow(2, (input.noiseLevel - input.criterionLevel) / input.exchangeRate))) * 100; results["dose"] = Number.isFinite(v) ? v : 0; } catch { results["dose"] = 0; }
  try { const v = (results["dose"] ?? 0) === 0 ? 0 : input.exchangeRate * (Math.log((results["dose"] ?? 0) / 100) / Math.LN2) + input.criterionLevel; results["twa"] = Number.isFinite(v) ? v : 0; } catch { results["twa"] = 0; }
  try { const v = input.noiseLevel < input.thresholdLevel ? Infinity : 8 / Math.pow(2, (input.noiseLevel - input.criterionLevel) / input.exchangeRate); results["allowableTime"] = Number.isFinite(v) ? v : 0; } catch { results["allowableTime"] = 0; }
  return results;
}


export function calculateNoise_exposure_calculator(input: Noise_exposure_calculatorInput): Noise_exposure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dose"] ?? 0;
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


export interface Noise_exposure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
