// Auto-generated from body-roundness-index-calculator-schema.json
import * as z from 'zod';

export interface Body_roundness_index_calculatorInput {
  waist_cm: number;
  height_cm: number;
  waist_in: number;
  height_in: number;
  dataConfidence?: number;
}

export const Body_roundness_index_calculatorInputSchema = z.object({
  waist_cm: z.number().default(90),
  height_cm: z.number().default(170),
  waist_in: z.number().default(35.43),
  height_in: z.number().default(66.93),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Body_roundness_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.waist_cm * input.height_cm * input.waist_in * input.height_in; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.waist_cm * input.height_cm * input.waist_in * input.height_in; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBody_roundness_index_calculator(input: Body_roundness_index_calculatorInput): Body_roundness_index_calculatorOutput {
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


export interface Body_roundness_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
