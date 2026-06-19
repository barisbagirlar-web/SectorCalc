// Auto-generated from baby-bmi-calculator-schema.json
import * as z from 'zod';

export interface Baby_bmi_calculatorInput {
  weight_kg: number;
  length_cm: number;
  weight_lb: number;
  length_in: number;
  dataConfidence?: number;
}

export const Baby_bmi_calculatorInputSchema = z.object({
  weight_kg: z.number(),
  length_cm: z.number(),
  weight_lb: z.number(),
  length_in: z.number(),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baby_bmi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight_kg * input.length_cm * input.weight_lb * input.length_in; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.weight_kg * input.length_cm * input.weight_lb * input.length_in; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaby_bmi_calculator(input: Baby_bmi_calculatorInput): Baby_bmi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Baby_bmi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
