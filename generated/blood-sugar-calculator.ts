// Auto-generated from blood-sugar-calculator-schema.json
import * as z from 'zod';

export interface Blood_sugar_calculatorInput {
  fasting_bs: number;
  postprandial_bs: number;
  random_bs: number;
  a1c: number;
  dataConfidence?: number;
}

export const Blood_sugar_calculatorInputSchema = z.object({
  fasting_bs: z.number().default(0),
  postprandial_bs: z.number().default(0),
  random_bs: z.number().default(0),
  a1c: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Blood_sugar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fasting_bs + input.postprandial_bs + input.random_bs) / 3; results["avg_bs_mgdl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["avg_bs_mgdl"] = 0; }
  try { const v = (asFormulaNumber(results["avg_bs_mgdl"])) / 18.0182; results["avg_bs_mmol"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["avg_bs_mmol"] = 0; }
  try { const v = ((asFormulaNumber(results["avg_bs_mgdl"])) + 46.7) / 28.7; results["estimated_a1c"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimated_a1c"] = 0; }
  try { const v = 28.7 * input.a1c - 46.7; results["eag_from_a1c"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["eag_from_a1c"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBlood_sugar_calculator(input: Blood_sugar_calculatorInput): Blood_sugar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["eag_from_a1c"]));
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


export interface Blood_sugar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
