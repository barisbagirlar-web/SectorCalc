// Auto-generated from btu-to-joules-calculator-schema.json
import * as z from 'zod';

export interface Btu_to_joules_calculatorInput {
  btuValue: number;
  btuStandard: number;
  precision: number;
  factorOverride: number;
  outputUnit: number;
}

export const Btu_to_joules_calculatorInputSchema = z.object({
  btuValue: z.number().default(0),
  btuStandard: z.number().default(1),
  precision: z.number().default(2),
  factorOverride: z.number().default(0),
  outputUnit: z.number().default(1),
});

function evaluateAllFormulas(input: Btu_to_joules_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.factorOverride !== 0 ? input.factorOverride : (input.btuStandard === 1 ? 1055.05585262 : (input.btuStandard === 2 ? 1054.350 : (input.btuStandard === 3 ? 1055.056 : (input.btuStandard === 4 ? 1055.87 : 1055.05585262)))); results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.btuValue * (results["conversionFactor"] ?? 0); results["rawJoules"] = Number.isFinite(v) ? v : 0; } catch { results["rawJoules"] = 0; }
  try { const v = input.outputUnit === 2 ? (results["rawJoules"] ?? 0) / 1000 : (results["rawJoules"] ?? 0); results["joules"] = Number.isFinite(v) ? v : 0; } catch { results["joules"] = 0; }
  try { const v = Math.round((results["joules"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedJoules"] = Number.isFinite(v) ? v : 0; } catch { results["roundedJoules"] = 0; }
  results["__conversionFactor__J_BTU_"] = 0;
  results["__rawJoules____outputUnit_____2____kJ___"] = 0;
  results["__btuStandard_____1____IT____btuStandard"] = 0;
  results["__precision__decimal_places_"] = 0;
  return results;
}


export function calculateBtu_to_joules_calculator(input: Btu_to_joules_calculatorInput): Btu_to_joules_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedJoules"] ?? 0;
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


export interface Btu_to_joules_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
