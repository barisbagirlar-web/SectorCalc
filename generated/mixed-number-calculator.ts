// Auto-generated from mixed-number-calculator-schema.json
import * as z from 'zod';

export interface Mixed_number_calculatorInput {
  op: number;
  whole1: number;
  num1: number;
  den1: number;
  whole2: number;
  num2: number;
  den2: number;
  dataConfidence?: number;
}

export const Mixed_number_calculatorInputSchema = z.object({
  op: z.number().default(1),
  whole1: z.number().default(3),
  num1: z.number().default(1),
  den1: z.number().default(2),
  whole2: z.number().default(2),
  num2: z.number().default(3),
  den2: z.number().default(4),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mixed_number_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.whole1 * input.den1 + input.num1) / input.den1; results["improper1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["improper1"] = 0; }
  try { const v = (input.whole2 * input.den2 + input.num2) / input.den2; results["improper2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["improper2"] = 0; }
  try { const v = input.op == 1 ? (asFormulaNumber(results["improper1"])) + (asFormulaNumber(results["improper2"])) : input.op == 2 ? (asFormulaNumber(results["improper1"])) - (asFormulaNumber(results["improper2"])) : input.op == 3 ? (asFormulaNumber(results["improper1"])) * (asFormulaNumber(results["improper2"])) : (asFormulaNumber(results["improper1"])) / (asFormulaNumber(results["improper2"])); results["decimalResult"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["decimalResult"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMixed_number_calculator(input: Mixed_number_calculatorInput): Mixed_number_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["decimalResult"]);
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


export interface Mixed_number_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
