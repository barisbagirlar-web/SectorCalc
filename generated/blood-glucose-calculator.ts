// Auto-generated from blood-glucose-calculator-schema.json
import * as z from 'zod';

export interface Blood_glucose_calculatorInput {
  mode: number;
  value1: number;
  unitFrom: number;
  unitTo: number;
  fasting: number;
}

export const Blood_glucose_calculatorInputSchema = z.object({
  mode: z.number().default(1),
  value1: z.number().default(100),
  unitFrom: z.number().default(1),
  unitTo: z.number().default(2),
  fasting: z.number().default(1),
});

function evaluateAllFormulas(input: Blood_glucose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mode===1 ? (input.unitFrom===1 ? (input.unitTo===2 ? input.value1/18.0182 : input.value1) : (input.unitTo===1 ? input.value1*18.0182 : input.value1)) : input.mode===2 ? 28.7*input.value1 - 46.7 : (input.value1 + 46.7)/28.7); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  results["mg_dL_to_mmol_L__divide_by_18_0182__mmol"] = 0;
  try { const v = 28.7 * HbA1c - 46.7; results["28_7___HbA1c___46_7"] = Number.isFinite(v) ? v : 0; } catch { results["28_7___HbA1c___46_7"] = 0; }
  try { const v = (eAG + 46.7) / 28.7; results["_eAG___46_7____28_7"] = Number.isFinite(v) ? v : 0; } catch { results["_eAG___46_7____28_7"] = 0; }
  return results;
}


export function calculateBlood_glucose_calculator(input: Blood_glucose_calculatorInput): Blood_glucose_calculatorOutput {
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


export interface Blood_glucose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
