// Auto-generated from ideal-weight-calculator-schema.json
import * as z from 'zod';

export interface Ideal_weight_calculatorInput {
  height_ft: number;
  height_in: number;
  gender: number;
  body_frame: number;
  dataConfidence?: number;
}

export const Ideal_weight_calculatorInputSchema = z.object({
  height_ft: z.number().default(5),
  height_in: z.number().default(0),
  gender: z.number().default(1),
  body_frame: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ideal_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.height_ft * input.height_in * input.gender * input.body_frame; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.height_ft * input.height_in * input.gender * input.body_frame; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateIdeal_weight_calculator(input: Ideal_weight_calculatorInput): Ideal_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Ideal_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
