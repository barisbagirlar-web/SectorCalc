// Auto-generated from us-gallons-to-imperial-gallons-calculator-schema.json
import * as z from 'zod';

export interface Us_gallons_to_imperial_gallons_calculatorInput {
  usGallons: number;
  conversionFactor: number;
  roundingPrecision: number;
  batchQuantity: number;
  temperatureC: number;
  measurementUncertainty: number;
}

export const Us_gallons_to_imperial_gallons_calculatorInputSchema = z.object({
  usGallons: z.number().default(0),
  conversionFactor: z.number().default(0.832674),
  roundingPrecision: z.number().default(2),
  batchQuantity: z.number().default(1),
  temperatureC: z.number().default(20),
  measurementUncertainty: z.number().default(0),
});

function evaluateAllFormulas(input: Us_gallons_to_imperial_gallons_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.usGallons * input.conversionFactor * input.batchQuantity; results["imperialUnrounded"] = Number.isFinite(v) ? v : 0; } catch { results["imperialUnrounded"] = 0; }
  try { const v = Math.round((results["imperialUnrounded"] ?? 0) * 10**input.roundingPrecision) / 10**input.roundingPrecision; results["imperialRounded"] = Number.isFinite(v) ? v : 0; } catch { results["imperialRounded"] = 0; }
  results["____usGallons_toFixed_2______gal__US__"] = 0;
  results["____conversionFactor_toFixed_6______Impe"] = 0;
  results["____batchQuantity"] = 0;
  results["____imperialUnrounded_toFixed_10______Im"] = 0;
  results["____imperialRounded_____Imperial_gallons"] = 0;
  try { const v = (results["imperialRounded"] ?? 0) + ' Imperial gallons'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateUs_gallons_to_imperial_gallons_calculator(input: Us_gallons_to_imperial_gallons_calculatorInput): Us_gallons_to_imperial_gallons_calculatorOutput {
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


export interface Us_gallons_to_imperial_gallons_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
