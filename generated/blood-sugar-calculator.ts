// Auto-generated from blood-sugar-calculator-schema.json
import * as z from 'zod';

export interface Blood_sugar_calculatorInput {
  fasting_bs: number;
  postprandial_bs: number;
  random_bs: number;
  a1c: number;
}

export const Blood_sugar_calculatorInputSchema = z.object({
  fasting_bs: z.number().default(0),
  postprandial_bs: z.number().default(0),
  random_bs: z.number().default(0),
  a1c: z.number().default(0),
});

function evaluateAllFormulas(input: Blood_sugar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fasting_bs + input.postprandial_bs + input.random_bs) / 3; results["avg_bs_mgdl"] = Number.isFinite(v) ? v : 0; } catch { results["avg_bs_mgdl"] = 0; }
  try { const v = (results["avg_bs_mgdl"] ?? 0) / 18.0182; results["avg_bs_mmol"] = Number.isFinite(v) ? v : 0; } catch { results["avg_bs_mmol"] = 0; }
  try { const v = ((results["avg_bs_mgdl"] ?? 0) + 46.7) / 28.7; results["estimated_a1c"] = Number.isFinite(v) ? v : 0; } catch { results["estimated_a1c"] = 0; }
  try { const v = 28.7 * input.a1c - 46.7; results["eag_from_a1c"] = Number.isFinite(v) ? v : 0; } catch { results["eag_from_a1c"] = 0; }
  results["__estimated_a1c__"] = 0;
  results["__eag_from_a1c__mg_dL"] = 0;
  results["__avg_bs_mmol__mmol_L"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateBlood_sugar_calculator(input: Blood_sugar_calculatorInput): Blood_sugar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Blood_sugar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
