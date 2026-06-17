// @ts-nocheck
// Auto-generated from deadlift-calculator-schema.json
import * as z from 'zod';

export interface Deadlift_calculatorInput {
  weight_lifted: number;
  repetitions: number;
  body_weight: number;
  fatigue_factor: number;
}

export const Deadlift_calculatorInputSchema = z.object({
  weight_lifted: z.number().default(100),
  repetitions: z.number().default(5),
  body_weight: z.number().default(80),
  fatigue_factor: z.number().default(90),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deadlift_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weight_lifted * (1 + input.repetitions / 30) * (input.fatigue_factor / 100); results["estimated_1rm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["estimated_1rm"] = 0; }
  try { const v = (input.weight_lifted * (1 + input.repetitions / 30) * (input.fatigue_factor / 100)) / input.body_weight; results["relative_strength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["relative_strength"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDeadlift_calculator(input: Deadlift_calculatorInput): Deadlift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimated_1rm"]);
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


export interface Deadlift_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
