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

function evaluateAllFormulas(input: Logistic_regression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.intercept + input.coef1 * input.value1 + input.coef2 * input.value2 + input.coef3 * input.value3; results["linearCombination"] = Number.isFinite(v) ? v : 0; } catch { results["linearCombination"] = 0; }
  try { const v = 1 / (1 + Math.exp(-(results["linearCombination"] ?? 0))); results["probability"] = Number.isFinite(v) ? v : 0; } catch { results["probability"] = 0; }
  try { const v = Math.exp((results["linearCombination"] ?? 0)); results["odds"] = Number.isFinite(v) ? v : 0; } catch { results["odds"] = 0; }
  return results;
}


export function calculateLogistic_regression_calculator(input: Logistic_regression_calculatorInput): Logistic_regression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probability"] ?? 0;
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


export interface Logistic_regression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
