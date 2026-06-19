// Auto-generated from fraction-calculator-schema.json
import * as z from 'zod';

export interface Fraction_calculatorInput {
  numerator1: number;
  denominator1: number;
  numerator2: number;
  denominator2: number;
  operation: number;
  dataConfidence?: number;
}

export const Fraction_calculatorInputSchema = z.object({
  numerator1: z.number().default(1),
  denominator1: z.number().default(2),
  numerator2: z.number().default(1),
  denominator2: z.number().default(3),
  operation: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fraction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operation === 0 ? input.numerator1*input.denominator2 + input.numerator2*input.denominator1 : input.operation === 1 ? input.numerator1*input.denominator2 - input.numerator2*input.denominator1 : input.operation === 2 ? input.numerator1*input.numerator2 : input.numerator1*input.denominator2; results["resultNumerator"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["resultNumerator"] = 0; }
  try { const v = input.operation === 2 ? input.denominator1*input.denominator2 : input.operation === 3 ? input.denominator1*input.numerator2 : input.denominator1*input.denominator2; results["resultDenominator"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["resultDenominator"] = 0; }
  try { const v = (asFormulaNumber(results["resultNumerator"])) / (asFormulaNumber(results["resultDenominator"])); results["decimal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["decimal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFraction_calculator(input: Fraction_calculatorInput): Fraction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["decimal"]);
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


export interface Fraction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
