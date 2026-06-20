// Auto-generated from subtract-fractions-calculator-schema.json
import * as z from 'zod';

export interface Subtract_fractions_calculatorInput {
  numerator1: number;
  denominator1: number;
  numerator2: number;
  denominator2: number;
  simplify: number;
  decimalPrecision: number;
  dataConfidence?: number;
}

export const Subtract_fractions_calculatorInputSchema = z.object({
  numerator1: z.number().default(0),
  denominator1: z.number().default(1),
  numerator2: z.number().default(0),
  denominator2: z.number().default(1),
  simplify: z.number().default(1),
  decimalPrecision: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Subtract_fractions_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.denominator1 * input.denominator2; results["commonDen"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["commonDen"] = Number.NaN; }
  try { const v = input.numerator1 * input.denominator2; results["num1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["num1"] = Number.NaN; }
  try { const v = input.numerator2 * input.denominator1; results["num2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["num2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["num1"])) - (toNumericFormulaValue(results["num2"])); results["resultNum"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["resultNum"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["commonDen"])); results["resultDen"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["resultDen"] = Number.NaN; }
  try { const v = (((input.denominator1 == 0 || input.denominator2 == 0) ? true : false) ? 1 : 0); results["error"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["error"] = Number.NaN; }
  return results;
}


export function calculateSubtract_fractions_calculator(input: Subtract_fractions_calculatorInput): Subtract_fractions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["error"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Subtract_fractions_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
