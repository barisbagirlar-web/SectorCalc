// @ts-nocheck
// Auto-generated from chi-square-test-calculator-schema.json
import * as z from 'zod';

export interface Chi_square_test_calculatorInput {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const Chi_square_test_calculatorInputSchema = z.object({
  a: z.number().default(0),
  b: z.number().default(0),
  c: z.number().default(0),
  d: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Chi_square_test_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.a + input.b + input.c + input.d; results["total"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total"] = 0; }
  try { const v = (input.a + input.b) * (input.a + input.c) / (asFormulaNumber(results["total"])); results["expectedA"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["expectedA"] = 0; }
  try { const v = (input.a + input.b) * (input.b + input.d) / (asFormulaNumber(results["total"])); results["expectedB"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["expectedB"] = 0; }
  try { const v = (input.c + input.d) * (input.a + input.c) / (asFormulaNumber(results["total"])); results["expectedC"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["expectedC"] = 0; }
  try { const v = (input.c + input.d) * (input.b + input.d) / (asFormulaNumber(results["total"])); results["expectedD"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["expectedD"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateChi_square_test_calculator(input: Chi_square_test_calculatorInput): Chi_square_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["expectedD"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Chi_square_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
