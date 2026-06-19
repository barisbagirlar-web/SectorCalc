// Auto-generated from jump-rope-calculator-schema.json
import * as z from 'zod';

export interface Jump_rope_calculatorInput {
  weight: number;
  jumpRate: number;
  duration: number;
  MET: number;
  dataConfidence?: number;
}

export const Jump_rope_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  jumpRate: z.number().default(100),
  duration: z.number().default(30),
  MET: z.number().default(11.8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Jump_rope_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.jumpRate * input.duration; results["totalJumps"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalJumps"] = 0; }
  try { const v = (input.MET * input.weight * 3.5 * input.duration) / 200; results["caloriesBurned"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = (input.MET * input.weight * 3.5) / 200; results["caloriesPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateJump_rope_calculator(input: Jump_rope_calculatorInput): Jump_rope_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["caloriesBurned"]);
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


export interface Jump_rope_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
