// Auto-generated from oil-barrels-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Oil_barrels_to_liters_calculatorInput {
  barrels: number;
  observedTemperature: number;
  referenceTemperature: number;
  alpha: number;
  precision: number;
}

export const Oil_barrels_to_liters_calculatorInputSchema = z.object({
  barrels: z.number().default(1),
  observedTemperature: z.number().default(20),
  referenceTemperature: z.number().default(15),
  alpha: z.number().default(0.0007),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Oil_barrels_to_liters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.barrels / (1 + input.alpha * (input.observedTemperature - input.referenceTemperature)); results["referenceBarrels"] = Number.isFinite(v) ? v : 0; } catch { results["referenceBarrels"] = 0; }
  try { const v = (results["referenceBarrels"] ?? 0) * 158.9873; results["rawLiters"] = Number.isFinite(v) ? v : 0; } catch { results["rawLiters"] = 0; }
  try { const v = Math.round((results["rawLiters"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedLiters"] = Number.isFinite(v) ? v : 0; } catch { results["roundedLiters"] = 0; }
  return results;
}


export function calculateOil_barrels_to_liters_calculator(input: Oil_barrels_to_liters_calculatorInput): Oil_barrels_to_liters_calculatorOutput {
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


export interface Oil_barrels_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
