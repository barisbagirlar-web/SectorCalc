// Auto-generated from chi-square-test-independence-calculator-schema.json
import * as z from 'zod';

export interface Chi_square_test_independence_calculatorInput {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const Chi_square_test_independence_calculatorInputSchema = z.object({
  a: z.number().default(10),
  b: z.number().default(10),
  c: z.number().default(10),
  d: z.number().default(10),
});

function evaluateAllFormulas(input: Chi_square_test_independence_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a + input.b + input.c + input.d; results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = (input.a + input.b) * (input.a + input.c) / (results["total"] ?? 0); results["expectedA"] = Number.isFinite(v) ? v : 0; } catch { results["expectedA"] = 0; }
  try { const v = (input.a + input.b) * (input.b + input.d) / (results["total"] ?? 0); results["expectedB"] = Number.isFinite(v) ? v : 0; } catch { results["expectedB"] = 0; }
  try { const v = (input.c + input.d) * (input.a + input.c) / (results["total"] ?? 0); results["expectedC"] = Number.isFinite(v) ? v : 0; } catch { results["expectedC"] = 0; }
  try { const v = (input.c + input.d) * (input.b + input.d) / (results["total"] ?? 0); results["expectedD"] = Number.isFinite(v) ? v : 0; } catch { results["expectedD"] = 0; }
  try { const v = ((input.a - (results["expectedA"] ?? 0))**2 / (results["expectedA"] ?? 0)) + ((input.b - (results["expectedB"] ?? 0))**2 / (results["expectedB"] ?? 0)) + ((input.c - (results["expectedC"] ?? 0))**2 / (results["expectedC"] ?? 0)) + ((input.d - (results["expectedD"] ?? 0))**2 / (results["expectedD"] ?? 0)); results["chi2"] = Number.isFinite(v) ? v : 0; } catch { results["chi2"] = 0; }
  try { const v = 1; results["df"] = Number.isFinite(v) ? v : 0; } catch { results["df"] = 0; }
  return results;
}


export function calculateChi_square_test_independence_calculator(input: Chi_square_test_independence_calculatorInput): Chi_square_test_independence_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["chi2"] ?? 0;
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


export interface Chi_square_test_independence_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
