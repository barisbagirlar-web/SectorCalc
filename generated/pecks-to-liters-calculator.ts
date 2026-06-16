// Auto-generated from pecks-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Pecks_to_liters_calculatorInput {
  peckType: number;
  peckQuantity: number;
  decimalPlaces: number;
  uncertaintyMargin: number;
  roundingMode: number;
  temperature: number;
}

export const Pecks_to_liters_calculatorInputSchema = z.object({
  peckType: z.number().default(0),
  peckQuantity: z.number().default(1),
  decimalPlaces: z.number().default(2),
  uncertaintyMargin: z.number().default(0),
  roundingMode: z.number().default(0),
  temperature: z.number().default(20),
});

function evaluateAllFormulas(input: Pecks_to_liters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.peckType == 0 ? 8.80977 : 9.09218; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.peckQuantity * (results["conversionFactor"] ?? 0); results["liters"] = Number.isFinite(v) ? v : 0; } catch { results["liters"] = 0; }
  try { const v = input.roundingMode == 0 ? Math.round((results["liters"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : (input.roundingMode == 1 ? Math.floor((results["liters"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : Math.ceil((results["liters"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces)); results["finalLiters"] = Number.isFinite(v) ? v : 0; } catch { results["finalLiters"] = 0; }
  return results;
}


export function calculatePecks_to_liters_calculator(input: Pecks_to_liters_calculatorInput): Pecks_to_liters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalLiters"] ?? 0;
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


export interface Pecks_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
