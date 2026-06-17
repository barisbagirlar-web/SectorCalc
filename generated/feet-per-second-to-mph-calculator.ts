// Auto-generated from feet-per-second-to-mph-calculator-schema.json
import * as z from 'zod';

export interface Feet_per_second_to_mph_calculatorInput {
  feetPerSecond: number;
  precision: number;
  calibrationOffset: number;
  outputUnitScaling: number;
}

export const Feet_per_second_to_mph_calculatorInputSchema = z.object({
  feetPerSecond: z.number().default(1),
  precision: z.number().default(2),
  calibrationOffset: z.number().default(0),
  outputUnitScaling: z.number().default(1),
});

function evaluateAllFormulas(input: Feet_per_second_to_mph_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { const mph = (input.feetPerSecond + input.calibrationOffset) * (3600 / 5280) * input.outputUnitScaling; return +mph.toFixed(input.precision); })(); results["convertToMph"] = Number.isFinite(v) ? v : 0; } catch { results["convertToMph"] = 0; }
  try { const v = input.feetPerSecond + input.calibrationOffset; results["adjustedSpeed___feetPerSecond___calibrat"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedSpeed___feetPerSecond___calibrat"] = 0; }
  try { const v = adjustedSpeed * (3600 / 5280) * input.outputUnitScaling; results["mphRaw___adjustedSpeed____3600___5280___"] = Number.isFinite(v) ? v : 0; } catch { results["mphRaw___adjustedSpeed____3600___5280___"] = 0; }
  try { const v = Math.round(mphRaw, input.precision); results["round_mphRaw__precision_"] = Number.isFinite(v) ? v : 0; } catch { results["round_mphRaw__precision_"] = 0; }
  return results;
}


export function calculateFeet_per_second_to_mph_calculator(input: Feet_per_second_to_mph_calculatorInput): Feet_per_second_to_mph_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["convertToMph"] ?? 0;
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


export interface Feet_per_second_to_mph_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
