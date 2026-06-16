// Auto-generated from bench-press-calculator-schema.json
import * as z from 'zod';

export interface Bench_press_calculatorInput {
  weight: number;
  reps: number;
  desiredReps: number;
  percentage: number;
}

export const Bench_press_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(8),
  desiredReps: z.number().default(1),
  percentage: z.number().default(70),
});

function evaluateAllFormulas(input: Bench_press_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps / 30); results["epley1RM"] = Number.isFinite(v) ? v : 0; } catch { results["epley1RM"] = 0; }
  try { const v = input.weight * (36 / (37 - input.reps)); results["brzycki1RM"] = Number.isFinite(v) ? v : 0; } catch { results["brzycki1RM"] = 0; }
  try { const v = (results["epley1RM"] ?? 0) / (1 + input.desiredReps / 30); results["weightForDesiredReps"] = Number.isFinite(v) ? v : 0; } catch { results["weightForDesiredReps"] = 0; }
  try { const v = (results["epley1RM"] ?? 0) * input.percentage / 100; results["weightAtPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["weightAtPercentage"] = 0; }
  return results;
}


export function calculateBench_press_calculator(input: Bench_press_calculatorInput): Bench_press_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["epley1RM"] ?? 0;
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


export interface Bench_press_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
