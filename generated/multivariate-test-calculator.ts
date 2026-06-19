// Auto-generated from multivariate-test-calculator-schema.json
import * as z from 'zod';

export interface Multivariate_test_calculatorInput {
  n: number;
  mean1: number;
  mean2: number;
  mean3: number;
  sd1: number;
  sd2: number;
  sd3: number;
  dataConfidence?: number;
}

export const Multivariate_test_calculatorInputSchema = z.object({
  n: z.number().default(30),
  mean1: z.number().default(10),
  mean2: z.number().default(12),
  mean3: z.number().default(11),
  sd1: z.number().default(2),
  sd2: z.number().default(2.5),
  sd3: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Multivariate_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mean1 + input.mean2 + input.mean3) / 3; results["grandMean"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grandMean"] = 0; }
  try { const v = input.n * ((input.mean1 - (asFormulaNumber(results["grandMean"]))) ** 2 + (input.mean2 - (asFormulaNumber(results["grandMean"]))) ** 2 + (input.mean3 - (asFormulaNumber(results["grandMean"]))) ** 2); results["ssb"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ssb"] = 0; }
  try { const v = (input.n - 1) * input.sd1 ** 2 + (input.n - 1) * input.sd2 ** 2 + (input.n - 1) * input.sd3 ** 2; results["ssw"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ssw"] = 0; }
  try { const v = (asFormulaNumber(results["ssb"])) / 2; results["msb"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["msb"] = 0; }
  try { const v = (asFormulaNumber(results["ssw"])) / (3 * (input.n - 1)); results["msw"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["msw"] = 0; }
  try { const v = (asFormulaNumber(results["msb"])) / (asFormulaNumber(results["msw"])); results["f"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["f"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMultivariate_test_calculator(input: Multivariate_test_calculatorInput): Multivariate_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["f"]);
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


export interface Multivariate_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
