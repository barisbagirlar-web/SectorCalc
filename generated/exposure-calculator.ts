// Auto-generated from exposure-calculator-schema.json
import * as z from 'zod';

export interface Exposure_calculatorInput {
  duration: number;
  spl: number;
  exchangeRate: number;
  criterionLevel: number;
  criterionTime: number;
}

export const Exposure_calculatorInputSchema = z.object({
  duration: z.number().default(8),
  spl: z.number().default(85),
  exchangeRate: z.number().default(3),
  criterionLevel: z.number().default(85),
  criterionTime: z.number().default(8),
});

function evaluateAllFormulas(input: Exposure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.spl + input.exchangeRate * Math.log(input.duration / input.criterionTime) / Math.log(2); results["dailyExposure"] = Number.isFinite(v) ? v : 0; } catch { results["dailyExposure"] = 0; }
  try { const v = (input.duration / input.criterionTime) * Math.pow(2, (input.spl - input.criterionLevel) / input.exchangeRate) * 100; results["dose"] = Number.isFinite(v) ? v : 0; } catch { results["dose"] = 0; }
  try { const v = (input.spl + input.exchangeRate * Math.log(input.duration / input.criterionTime) / Math.log(2) > input.criterionLevel) ? (input.spl + input.exchangeRate * Math.log(input.duration / input.criterionTime) / Math.log(2) - input.criterionLevel) : 0; results["exceedance"] = Number.isFinite(v) ? v : 0; } catch { results["exceedance"] = 0; }
  results["Noise_Dose____"] = 0;
  results["Limit_Exceedance__dB_"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateExposure_calculator(input: Exposure_calculatorInput): Exposure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Exposure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
