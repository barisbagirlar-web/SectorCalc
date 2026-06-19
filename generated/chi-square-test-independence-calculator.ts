// Auto-generated from chi-square-test-independence-calculator-schema.json
import * as z from 'zod';

export interface Chi_square_test_independence_calculatorInput {
  a: number;
  b: number;
  c: number;
  d: number;
  dataConfidence?: number;
}

export const Chi_square_test_independence_calculatorInputSchema = z.object({
  a: z.number().default(10),
  b: z.number().default(10),
  c: z.number().default(10),
  d: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Chi_square_test_independence_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a + input.b + input.c + input.d; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = (input.a + input.b) * (input.a + input.c) / (asFormulaNumber(results["total"])); results["expectedA"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedA"] = 0; }
  try { const v = (input.a + input.b) * (input.b + input.d) / (asFormulaNumber(results["total"])); results["expectedB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedB"] = 0; }
  try { const v = (input.c + input.d) * (input.a + input.c) / (asFormulaNumber(results["total"])); results["expectedC"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedC"] = 0; }
  try { const v = (input.c + input.d) * (input.b + input.d) / (asFormulaNumber(results["total"])); results["expectedD"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedD"] = 0; }
  try { const v = ((input.a - (asFormulaNumber(results["expectedA"])))**2 / (asFormulaNumber(results["expectedA"]))) + ((input.b - (asFormulaNumber(results["expectedB"])))**2 / (asFormulaNumber(results["expectedB"]))) + ((input.c - (asFormulaNumber(results["expectedC"])))**2 / (asFormulaNumber(results["expectedC"]))) + ((input.d - (asFormulaNumber(results["expectedD"])))**2 / (asFormulaNumber(results["expectedD"]))); results["chi2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["chi2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateChi_square_test_independence_calculator(input: Chi_square_test_independence_calculatorInput): Chi_square_test_independence_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["chi2"]));
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


export interface Chi_square_test_independence_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
