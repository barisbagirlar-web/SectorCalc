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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chi_square_test_independence_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a + input.b + input.c + input.d; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = (input.a + input.b) * (input.a + input.c) / (toNumericFormulaValue(results["total"])); results["expectedA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedA"] = Number.NaN; }
  try { const v = (input.a + input.b) * (input.b + input.d) / (toNumericFormulaValue(results["total"])); results["expectedB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedB"] = Number.NaN; }
  try { const v = (input.c + input.d) * (input.a + input.c) / (toNumericFormulaValue(results["total"])); results["expectedC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedC"] = Number.NaN; }
  try { const v = (input.c + input.d) * (input.b + input.d) / (toNumericFormulaValue(results["total"])); results["expectedD"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedD"] = Number.NaN; }
  try { const v = ((input.a - (toNumericFormulaValue(results["expectedA"])))**2 / (toNumericFormulaValue(results["expectedA"]))) + ((input.b - (toNumericFormulaValue(results["expectedB"])))**2 / (toNumericFormulaValue(results["expectedB"]))) + ((input.c - (toNumericFormulaValue(results["expectedC"])))**2 / (toNumericFormulaValue(results["expectedC"]))) + ((input.d - (toNumericFormulaValue(results["expectedD"])))**2 / (toNumericFormulaValue(results["expectedD"]))); results["chi2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chi2"] = Number.NaN; }
  return results;
}


export function calculateChi_square_test_independence_calculator(input: Chi_square_test_independence_calculatorInput): Chi_square_test_independence_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["chi2"]);
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


export interface Chi_square_test_independence_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
