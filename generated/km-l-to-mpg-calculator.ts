// Auto-generated from km-l-to-mpg-calculator-schema.json
import * as z from 'zod';

export interface Km_l_to_mpg_calculatorInput {
  value: number;
  sourceUnit: number;
  decimalPlaces: number;
  gallonType: number;
}

export const Km_l_to_mpg_calculatorInputSchema = z.object({
  value: z.number().default(1),
  sourceUnit: z.number().default(0),
  decimalPlaces: z.number().default(2),
  gallonType: z.number().default(0),
});

function evaluateAllFormulas(input: Km_l_to_mpg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sourceUnit == 0 ? (input.gallonType == 0 ? input.value * 2.352145833333333 : input.value * 2.8248094) : (input.gallonType == 0 ? input.value / 2.352145833333333 : input.value / 2.8248094)).toFixed(input.decimalPlaces) + (input.sourceUnit == 0 ? (input.gallonType == 0 ? ' mpg (US)' : ' mpg (UK)') : (input.gallonType == 0 ? ' km/L (from US mpg)' : ' km/L (from UK mpg)')); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateKm_l_to_mpg_calculator(input: Km_l_to_mpg_calculatorInput): Km_l_to_mpg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Km_l_to_mpg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
