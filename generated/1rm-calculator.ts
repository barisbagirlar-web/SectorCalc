// @ts-nocheck
// Auto-generated from 1rm-calculator-schema.json
import * as z from 'zod';

export interface _1rm_calculatorInput {
  weight1: number;
  reps1: number;
  weight2: number;
  reps2: number;
  weight3: number;
  reps3: number;
}

export const _1rm_calculatorInputSchema = z.object({
  weight1: z.number().default(100),
  reps1: z.number().default(10),
  weight2: z.number().default(80),
  reps2: z.number().default(15),
  weight3: z.number().default(60),
  reps3: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _1rm_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weight1 * (1 + input.reps1 / 30); results["set1Estimate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["set1Estimate"] = 0; }
  try { const v = input.weight2 * (1 + input.reps2 / 30); results["set2Estimate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["set2Estimate"] = 0; }
  try { const v = input.weight3 * (1 + input.reps3 / 30); results["set3Estimate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["set3Estimate"] = 0; }
  try { const v = ((asFormulaNumber(results["set1Estimate"])) + (asFormulaNumber(results["set2Estimate"])) + (asFormulaNumber(results["set3Estimate"]))) / 3; results["estimated1RM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["estimated1RM"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculate_1rm_calculator(input: _1rm_calculatorInput): _1rm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimated1RM"]);
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


export interface _1rm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
