// Auto-generated from register-tons-to-cubic-meters-calculator-schema.json
import * as z from 'zod';

export interface Register_tons_to_cubic_meters_calculatorInput {
  registerTons: number;
  cubicMeters: number;
  direction: number;
  decimalPlaces: number;
  useStandardConversion: number;
  customFactor: number;
}

export const Register_tons_to_cubic_meters_calculatorInputSchema = z.object({
  registerTons: z.number().default(1),
  cubicMeters: z.number().default(0),
  direction: z.number().default(0),
  decimalPlaces: z.number().default(2),
  useStandardConversion: z.number().default(1),
  customFactor: z.number().default(2.8316846592),
});

function evaluateAllFormulas(input: Register_tons_to_cubic_meters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.useStandardConversion === 1 ? 2.8316846592 : input.customFactor; results["factor"] = Number.isFinite(v) ? v : 0; } catch { results["factor"] = 0; }
  try { const v = input.direction === 0 ? input.registerTons * (results["factor"] ?? 0) : input.cubicMeters / (results["factor"] ?? 0); results["rawResult"] = Number.isFinite(v) ? v : 0; } catch { results["rawResult"] = 0; }
  try { const v = Math.round((results["rawResult"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateRegister_tons_to_cubic_meters_calculator(input: Register_tons_to_cubic_meters_calculatorInput): Register_tons_to_cubic_meters_calculatorOutput {
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


export interface Register_tons_to_cubic_meters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
