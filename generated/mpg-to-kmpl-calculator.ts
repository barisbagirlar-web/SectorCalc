// Auto-generated from mpg-to-kmpl-calculator-schema.json
import * as z from 'zod';

export interface Mpg_to_kmpl_calculatorInput {
  mpg: number;
  gallonType: number;
  decimalPlaces: number;
  customLitersPerGallon: number;
}

export const Mpg_to_kmpl_calculatorInputSchema = z.object({
  mpg: z.number().default(30),
  gallonType: z.number().default(0),
  decimalPlaces: z.number().default(2),
  customLitersPerGallon: z.number().default(0),
});

function evaluateAllFormulas(input: Mpg_to_kmpl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.customLitersPerGallon > 0) ? input.customLitersPerGallon : (input.gallonType === 1 ? 4.54609 : 3.785411784); results["litersUsed"] = Number.isFinite(v) ? v : 0; } catch { results["litersUsed"] = 0; }
  try { const v = input.mpg * 1.609344 / (results["litersUsed"] ?? 0); results["kmPerLiterExact"] = Number.isFinite(v) ? v : 0; } catch { results["kmPerLiterExact"] = 0; }
  try { const v = Math.round((results["kmPerLiterExact"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["roundedKmPerLiter"] = Number.isFinite(v) ? v : 0; } catch { results["roundedKmPerLiter"] = 0; }
  return results;
}


export function calculateMpg_to_kmpl_calculator(input: Mpg_to_kmpl_calculatorInput): Mpg_to_kmpl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedKmPerLiter"] ?? 0;
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


export interface Mpg_to_kmpl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
