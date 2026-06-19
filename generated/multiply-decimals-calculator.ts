// Auto-generated from multiply-decimals-calculator-schema.json
import * as z from 'zod';

export interface Multiply_decimals_calculatorInput {
  inputA: number;
  inputB: number;
  multiplierAdjustment: number;
  roundingPrecision: number;
  dataConfidence?: number;
}

export const Multiply_decimals_calculatorInputSchema = z.object({
  inputA: z.number().default(0),
  inputB: z.number().default(0),
  multiplierAdjustment: z.number().default(1),
  roundingPrecision: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Multiply_decimals_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inputA * input.inputB * input.multiplierAdjustment; results["unroundedProduct"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unroundedProduct"] = 0; }
  try { const v = input.inputA * input.inputB * input.multiplierAdjustment; results["unroundedProduct_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unroundedProduct_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMultiply_decimals_calculator(input: Multiply_decimals_calculatorInput): Multiply_decimals_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["unroundedProduct_aux"]));
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


export interface Multiply_decimals_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
