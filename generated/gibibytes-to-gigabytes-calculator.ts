// Auto-generated from gibibytes-to-gigabytes-calculator-schema.json
import * as z from 'zod';

export interface Gibibytes_to_gigabytes_calculatorInput {
  gibibytes: number;
  conversionFactor: number;
  decimalPlaces: number;
  safetyFactorPercent: number;
}

export const Gibibytes_to_gigabytes_calculatorInputSchema = z.object({
  gibibytes: z.number().default(1),
  conversionFactor: z.number().default(1.073741824),
  decimalPlaces: z.number().default(2),
  safetyFactorPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Gibibytes_to_gigabytes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gibibytes * input.conversionFactor; results["rawGigabytes"] = Number.isFinite(v) ? v : 0; } catch { results["rawGigabytes"] = 0; }
  try { const v = (results["rawGigabytes"] ?? 0) * (1 + input.safetyFactorPercent / 100); results["safetyAppliedGigabytes"] = Number.isFinite(v) ? v : 0; } catch { results["safetyAppliedGigabytes"] = 0; }
  try { const v = Math.round((results["safetyAppliedGigabytes"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["roundedGigabytes"] = Number.isFinite(v) ? v : 0; } catch { results["roundedGigabytes"] = 0; }
  return results;
}


export function calculateGibibytes_to_gigabytes_calculator(input: Gibibytes_to_gigabytes_calculatorInput): Gibibytes_to_gigabytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedGigabytes"] ?? 0;
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


export interface Gibibytes_to_gigabytes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
