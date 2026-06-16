// Auto-generated from gallon-to-liter-converter-calculator-schema.json
import * as z from 'zod';

export interface Gallon_to_liter_converter_calculatorInput {
  containerCount: number;
  gallonsPerContainer: number;
  unitType: number;
  customFactor: number;
  wastePercentage: number;
  outputDecimals: number;
}

export const Gallon_to_liter_converter_calculatorInputSchema = z.object({
  containerCount: z.number().default(1),
  gallonsPerContainer: z.number().default(0),
  unitType: z.number().default(0),
  customFactor: z.number().default(0),
  wastePercentage: z.number().default(0),
  outputDecimals: z.number().default(2),
});

function evaluateAllFormulas(input: Gallon_to_liter_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.unitType === 0 ? 3.78541 : 4.54609; results["standardFactor"] = Number.isFinite(v) ? v : 0; } catch { results["standardFactor"] = 0; }
  try { const v = input.customFactor > 0 ? input.customFactor : (results["standardFactor"] ?? 0); results["effectiveFactor"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveFactor"] = 0; }
  try { const v = input.containerCount * input.gallonsPerContainer; results["totalGallons"] = Number.isFinite(v) ? v : 0; } catch { results["totalGallons"] = 0; }
  try { const v = (results["totalGallons"] ?? 0) * (results["effectiveFactor"] ?? 0) * (1 + input.wastePercentage / 100); results["totalLiters"] = Number.isFinite(v) ? v : 0; } catch { results["totalLiters"] = 0; }
  try { const v = Math.round((results["totalLiters"] ?? 0) * Math.pow(10, input.outputDecimals)) / Math.pow(10, input.outputDecimals); results["roundedLiters"] = Number.isFinite(v) ? v : 0; } catch { results["roundedLiters"] = 0; }
  return results;
}


export function calculateGallon_to_liter_converter_calculator(input: Gallon_to_liter_converter_calculatorInput): Gallon_to_liter_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedLiters"] ?? 0;
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


export interface Gallon_to_liter_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
