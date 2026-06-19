// Auto-generated from conditional-probability-calculator-schema.json
import * as z from 'zod';

export interface Conditional_probability_calculatorInput {
  mode: number;
  pIntersection: number;
  pB: number;
  countBoth: number;
  countB: number;
  dataConfidence?: number;
}

export const Conditional_probability_calculatorInputSchema = z.object({
  mode: z.number().default(0),
  pIntersection: z.number().default(0.3),
  pB: z.number().default(0.5),
  countBoth: z.number().default(30),
  countB: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Conditional_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.mode === 0 ? input.pIntersection : input.countBoth) ? 1 : 0); results["numerator"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numerator"] = 0; }
  try { const v = ((input.mode === 0 ? input.pB : input.countB) ? 1 : 0); results["denominator"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = (asFormulaNumber(results["numerator"])) / (asFormulaNumber(results["denominator"])); results["conditionalProbability"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conditionalProbability"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConditional_probability_calculator(input: Conditional_probability_calculatorInput): Conditional_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["conditionalProbability"]);
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


export interface Conditional_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
