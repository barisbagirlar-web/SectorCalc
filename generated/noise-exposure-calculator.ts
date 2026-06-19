// Auto-generated from noise-exposure-calculator-schema.json
import * as z from 'zod';

export interface Noise_exposure_calculatorInput {
  noiseLevel: number;
  exposureTime: number;
  exchangeRate: number;
  criterionLevel: number;
  thresholdLevel: number;
  dataConfidence?: number;
}

export const Noise_exposure_calculatorInputSchema = z.object({
  noiseLevel: z.number().default(90),
  exposureTime: z.number().default(8),
  exchangeRate: z.number().default(3),
  criterionLevel: z.number().default(85),
  thresholdLevel: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Noise_exposure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.noiseLevel * input.exposureTime * input.exchangeRate * input.criterionLevel; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.noiseLevel * input.exposureTime * input.exchangeRate * input.criterionLevel * (input.thresholdLevel); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.thresholdLevel; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNoise_exposure_calculator(input: Noise_exposure_calculatorInput): Noise_exposure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Noise_exposure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
