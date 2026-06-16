// Auto-generated from 20-20-vision-calculator-schema.json
import * as z from 'zod';

export interface _20_20_vision_calculatorInput {
  viewingFeet: number;
  letterFeet: number;
  viewingMeters: number;
  letterMeters: number;
  targetDecimalAcuity: number;
}

export const _20_20_vision_calculatorInputSchema = z.object({
  viewingFeet: z.number().default(20),
  letterFeet: z.number().default(20),
  viewingMeters: z.number().default(6),
  letterMeters: z.number().default(6),
  targetDecimalAcuity: z.number().default(0),
});

function evaluateAllFormulas(input: _20_20_vision_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.viewingFeet > 0 && input.letterFeet > 0) ? input.viewingFeet / input.letterFeet : (input.viewingMeters > 0 && input.letterMeters > 0) ? input.viewingMeters / input.letterMeters : 1; results["decimalAcuity"] = Number.isFinite(v) ? v : 0; } catch { results["decimalAcuity"] = 0; }
  try { const v = Math.log(1 / ((input.viewingFeet > 0 && input.letterFeet > 0) ? input.viewingFeet / input.letterFeet : (input.viewingMeters > 0 && input.letterMeters > 0) ? input.viewingMeters / input.letterMeters : 1)) / Math.LN10; results["logMAR"] = Number.isFinite(v) ? v : 0; } catch { results["logMAR"] = 0; }
  try { const v = 1 / ((input.viewingFeet > 0 && input.letterFeet > 0) ? input.viewingFeet / input.letterFeet : (input.viewingMeters > 0 && input.letterMeters > 0) ? input.viewingMeters / input.letterMeters : 1); results["MAR_arcmin"] = Number.isFinite(v) ? v : 0; } catch { results["MAR_arcmin"] = 0; }
  try { const v = input.targetDecimalAcuity > 0 ? ((input.viewingFeet > 0) ? input.viewingFeet : input.viewingMeters) / input.targetDecimalAcuity : 0; results["requiredLetterDistance"] = Number.isFinite(v) ? v : 0; } catch { results["requiredLetterDistance"] = 0; }
  return results;
}


export function calculate_20_20_vision_calculator(input: _20_20_vision_calculatorInput): _20_20_vision_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["logMAR"] ?? 0;
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


export interface _20_20_vision_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
