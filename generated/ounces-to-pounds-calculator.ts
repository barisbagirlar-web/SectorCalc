// Auto-generated from ounces-to-pounds-calculator-schema.json
import * as z from 'zod';

export interface Ounces_to_pounds_calculatorInput {
  ounces: number;
  quantity: number;
  tare: number;
  conversionFactor: number;
}

export const Ounces_to_pounds_calculatorInputSchema = z.object({
  ounces: z.number().default(0),
  quantity: z.number().default(1),
  tare: z.number().default(0),
  conversionFactor: z.number().default(16),
});

function evaluateAllFormulas(input: Ounces_to_pounds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ounces * input.quantity + input.tare; results["totalOunces"] = Number.isFinite(v) ? v : 0; } catch { results["totalOunces"] = 0; }
  try { const v = (results["totalOunces"] ?? 0) / input.conversionFactor; results["pounds"] = Number.isFinite(v) ? v : 0; } catch { results["pounds"] = 0; }
  try { const v = input.conversionFactor; results["conversionFactorUsed"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactorUsed"] = 0; }
  return results;
}


export function calculateOunces_to_pounds_calculator(input: Ounces_to_pounds_calculatorInput): Ounces_to_pounds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pounds"] ?? 0;
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


export interface Ounces_to_pounds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
