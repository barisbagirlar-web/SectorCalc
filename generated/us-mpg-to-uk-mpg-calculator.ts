// Auto-generated from us-mpg-to-uk-mpg-calculator-schema.json
import * as z from 'zod';

export interface Us_mpg_to_uk_mpg_calculatorInput {
  usMpg: number;
  conversionFactor: number;
  precision: number;
  referenceValue: number;
}

export const Us_mpg_to_uk_mpg_calculatorInputSchema = z.object({
  usMpg: z.number().default(25),
  conversionFactor: z.number().default(1.20095),
  precision: z.number().default(2),
  referenceValue: z.number().default(30),
});

function evaluateAllFormulas(input: Us_mpg_to_uk_mpg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.usMpg * input.conversionFactor; results["rawUkMpg"] = Number.isFinite(v) ? v : 0; } catch { results["rawUkMpg"] = 0; }
  try { const v = Math.round((results["rawUkMpg"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedUkMpg"] = Number.isFinite(v) ? v : 0; } catch { results["roundedUkMpg"] = 0; }
  try { const v = (results["roundedUkMpg"] ?? 0); results["ukMpg"] = Number.isFinite(v) ? v : 0; } catch { results["ukMpg"] = 0; }
  try { const v = (results["roundedUkMpg"] ?? 0) - input.referenceValue; results["difference"] = Number.isFinite(v) ? v : 0; } catch { results["difference"] = 0; }
  return results;
}


export function calculateUs_mpg_to_uk_mpg_calculator(input: Us_mpg_to_uk_mpg_calculatorInput): Us_mpg_to_uk_mpg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ukMpg"] ?? 0;
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


export interface Us_mpg_to_uk_mpg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
