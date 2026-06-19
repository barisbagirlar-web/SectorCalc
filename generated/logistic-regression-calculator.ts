// Auto-generated from logistic-regression-calculator-schema.json
import * as z from 'zod';

export interface Logistic_regression_calculatorInput {
  intercept: number;
  coef1: number;
  value1: number;
  coef2: number;
  value2: number;
  coef3: number;
  value3: number;
  dataConfidence?: number;
}

export const Logistic_regression_calculatorInputSchema = z.object({
  intercept: z.number().default(0),
  coef1: z.number().default(0),
  value1: z.number().default(0),
  coef2: z.number().default(0),
  value2: z.number().default(0),
  coef3: z.number().default(0),
  value3: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Logistic_regression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.intercept + input.coef1 * input.value1 + input.coef2 * input.value2 + input.coef3 * input.value3; results["linearCombination"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["linearCombination"] = 0; }
  try { const v = input.intercept + input.coef1 * input.value1 + input.coef2 * input.value2 + input.coef3 * input.value3; results["linearCombination_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["linearCombination_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLogistic_regression_calculator(input: Logistic_regression_calculatorInput): Logistic_regression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["linearCombination_aux"]));
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


export interface Logistic_regression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
