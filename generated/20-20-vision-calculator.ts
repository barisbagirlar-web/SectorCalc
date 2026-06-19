// Auto-generated from 20-20-vision-calculator-schema.json
import * as z from 'zod';

export interface _20_20_vision_calculatorInput {
  viewingFeet: number;
  letterFeet: number;
  viewingMeters: number;
  letterMeters: number;
  targetDecimalAcuity: number;
  dataConfidence?: number;
}

export const _20_20_vision_calculatorInputSchema = z.object({
  viewingFeet: z.number().default(20),
  letterFeet: z.number().default(20),
  viewingMeters: z.number().default(6),
  letterMeters: z.number().default(6),
  targetDecimalAcuity: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _20_20_vision_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (((input.viewingFeet > 0 && input.letterFeet > 0) ? input.viewingFeet / input.letterFeet : (input.viewingMeters > 0 && input.letterMeters > 0) ? input.viewingMeters / input.letterMeters : 1) ? 1 : 0); results["decimalAcuity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["decimalAcuity"] = 0; }
  try { const v = ((1 / ((input.viewingFeet > 0 && input.letterFeet > 0) ? input.viewingFeet / input.letterFeet : (input.viewingMeters > 0 && input.letterMeters > 0) ? input.viewingMeters / input.letterMeters : 1)) ? 1 : 0); results["MAR_arcmin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["MAR_arcmin"] = 0; }
  try { const v = input.targetDecimalAcuity > 0 ? ((input.viewingFeet > 0) ? input.viewingFeet : input.viewingMeters) / input.targetDecimalAcuity : 0; results["requiredLetterDistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredLetterDistance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_20_20_vision_calculator(input: _20_20_vision_calculatorInput): _20_20_vision_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["requiredLetterDistance"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
