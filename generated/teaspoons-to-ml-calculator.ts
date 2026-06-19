// Auto-generated from teaspoons-to-ml-calculator-schema.json
import * as z from 'zod';

export interface Teaspoons_to_ml_calculatorInput {
  teaspoons: number;
  mlPerTeaspoon: number;
  decimalPlaces: number;
  numberOfConversions: number;
  dataConfidence?: number;
}

export const Teaspoons_to_ml_calculatorInputSchema = z.object({
  teaspoons: z.number().default(1),
  mlPerTeaspoon: z.number().default(5),
  decimalPlaces: z.number().default(2),
  numberOfConversions: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Teaspoons_to_ml_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.teaspoons * input.mlPerTeaspoon * input.decimalPlaces * input.numberOfConversions; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.teaspoons * input.mlPerTeaspoon * input.decimalPlaces * input.numberOfConversions; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTeaspoons_to_ml_calculator(input: Teaspoons_to_ml_calculatorInput): Teaspoons_to_ml_calculatorOutput {
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


export interface Teaspoons_to_ml_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
