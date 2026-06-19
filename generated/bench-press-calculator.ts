// Auto-generated from bench-press-calculator-schema.json
import * as z from 'zod';

export interface Bench_press_calculatorInput {
  weight: number;
  reps: number;
  desiredReps: number;
  percentage: number;
  dataConfidence?: number;
}

export const Bench_press_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(8),
  desiredReps: z.number().default(1),
  percentage: z.number().default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bench_press_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps / 30); results["epley1RM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["epley1RM"] = 0; }
  try { const v = input.weight * (36 / (37 - input.reps)); results["brzycki1RM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["brzycki1RM"] = 0; }
  try { const v = (asFormulaNumber(results["epley1RM"])) / (1 + input.desiredReps / 30); results["weightForDesiredReps"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightForDesiredReps"] = 0; }
  try { const v = (asFormulaNumber(results["epley1RM"])) * input.percentage / 100; results["weightAtPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightAtPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBench_press_calculator(input: Bench_press_calculatorInput): Bench_press_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["epley1RM"]));
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


export interface Bench_press_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
