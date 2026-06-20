// Auto-generated from 1rm-calculator-schema.json
import * as z from 'zod';

export interface _1rm_calculatorInput {
  weight1: number;
  reps1: number;
  weight2: number;
  reps2: number;
  weight3: number;
  reps3: number;
  dataConfidence?: number;
}

export const _1rm_calculatorInputSchema = z.object({
  weight1: z.number().default(100),
  reps1: z.number().default(10),
  weight2: z.number().default(80),
  reps2: z.number().default(15),
  weight3: z.number().default(60),
  reps3: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _1rm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight1 * (1 + input.reps1 / 30); results["set1Estimate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["set1Estimate"] = Number.NaN; }
  try { const v = input.weight2 * (1 + input.reps2 / 30); results["set2Estimate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["set2Estimate"] = Number.NaN; }
  try { const v = input.weight3 * (1 + input.reps3 / 30); results["set3Estimate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["set3Estimate"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["set1Estimate"])) + (toNumericFormulaValue(results["set2Estimate"])) + (toNumericFormulaValue(results["set3Estimate"]))) / 3; results["estimated1RM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["estimated1RM"] = Number.NaN; }
  return results;
}


export function calculate_1rm_calculator(input: _1rm_calculatorInput): _1rm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimated1RM"]);
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


export interface _1rm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
