// Auto-generated from km-l-to-mpg-calculator-schema.json
import * as z from 'zod';

export interface Km_l_to_mpg_calculatorInput {
  value: number;
  sourceUnit: number;
  decimalPlaces: number;
  gallonType: number;
  dataConfidence?: number;
}

export const Km_l_to_mpg_calculatorInputSchema = z.object({
  value: z.number().default(1),
  sourceUnit: z.number().default(0),
  decimalPlaces: z.number().default(2),
  gallonType: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Km_l_to_mpg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.value * input.sourceUnit * input.decimalPlaces * input.gallonType; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.value * input.sourceUnit * input.decimalPlaces * input.gallonType; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKm_l_to_mpg_calculator(input: Km_l_to_mpg_calculatorInput): Km_l_to_mpg_calculatorOutput {
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


export interface Km_l_to_mpg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
