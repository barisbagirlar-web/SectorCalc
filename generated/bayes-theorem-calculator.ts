// Auto-generated from bayes-theorem-calculator-schema.json
import * as z from 'zod';

export interface Bayes_theorem_calculatorInput {
  prior: number;
  sensitivity: number;
  specificity: number;
  testResult: number;
  dataConfidence?: number;
}

export const Bayes_theorem_calculatorInputSchema = z.object({
  prior: z.number().default(0.01),
  sensitivity: z.number().default(0.95),
  specificity: z.number().default(0.98),
  testResult: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bayes_theorem_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - input.specificity; results["falsePositiveRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["falsePositiveRate"] = 0; }
  try { const v = 1 - input.sensitivity; results["falseNegativeRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["falseNegativeRate"] = 0; }
  try { const v = input.testResult == 1 ? input.sensitivity * input.prior : (asFormulaNumber(results["falseNegativeRate"])) * input.prior; results["numerator"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numerator"] = 0; }
  try { const v = input.testResult == 1 ? (input.sensitivity * input.prior + (asFormulaNumber(results["falsePositiveRate"])) * (1 - input.prior)) : ((asFormulaNumber(results["falseNegativeRate"])) * input.prior + input.specificity * (1 - input.prior)); results["denominator"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = input.testResult == 1 ? (input.sensitivity * input.prior) / (input.sensitivity * input.prior + (asFormulaNumber(results["falsePositiveRate"])) * (1 - input.prior)) : ((asFormulaNumber(results["falseNegativeRate"])) * input.prior) / ((asFormulaNumber(results["falseNegativeRate"])) * input.prior + input.specificity * (1 - input.prior)); results["posterior"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["posterior"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBayes_theorem_calculator(input: Bayes_theorem_calculatorInput): Bayes_theorem_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["posterior"]);
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


export interface Bayes_theorem_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
