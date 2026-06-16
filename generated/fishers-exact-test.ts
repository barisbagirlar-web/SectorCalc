// Auto-generated from fishers-exact-test-schema.json
import * as z from 'zod';

export interface Fishers_exact_testInput {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const Fishers_exact_testInputSchema = z.object({
  a: z.number().default(5),
  b: z.number().default(1),
  c: z.number().default(2),
  d: z.number().default(6),
});

function evaluateAllFormulas(input: Fishers_exact_testInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a + input.b + input.c + input.d; results["n"] = Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = input.a + input.b; results["row1"] = Number.isFinite(v) ? v : 0; } catch { results["row1"] = 0; }
  try { const v = input.c + input.d; results["row2"] = Number.isFinite(v) ? v : 0; } catch { results["row2"] = 0; }
  try { const v = input.a + input.c; results["col1"] = Number.isFinite(v) ? v : 0; } catch { results["col1"] = 0; }
  try { const v = input.b + input.d; results["col2"] = Number.isFinite(v) ? v : 0; } catch { results["col2"] = 0; }
  try { const v = (function(x) { if (x <= 1) return 0; var res = 0; for (var i = 2; i <= x; i++) res += Math.log(i); return res; })(x); results["lnFactorial"] = Number.isFinite(v) ? v : 0; } catch { results["lnFactorial"] = 0; }
  try { const v = (results["lnFactorial"] ?? 0)((results["row1"] ?? 0)) + (results["lnFactorial"] ?? 0)((results["row2"] ?? 0)) + (results["lnFactorial"] ?? 0)((results["col1"] ?? 0)) + (results["lnFactorial"] ?? 0)((results["col2"] ?? 0)) - (results["lnFactorial"] ?? 0)((results["n"] ?? 0)) - (results["lnFactorial"] ?? 0)(input.a) - (results["lnFactorial"] ?? 0)(input.b) - (results["lnFactorial"] ?? 0)(input.c) - (results["lnFactorial"] ?? 0)(input.d); results["lnP"] = Number.isFinite(v) ? v : 0; } catch { results["lnP"] = 0; }
  try { const v = Math.exp((results["lnP"] ?? 0)); results["pValue"] = Number.isFinite(v) ? v : 0; } catch { results["pValue"] = 0; }
  return results;
}


export function calculateFishers_exact_test(input: Fishers_exact_testInput): Fishers_exact_testOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pValue"] ?? 0;
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


export interface Fishers_exact_testOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
