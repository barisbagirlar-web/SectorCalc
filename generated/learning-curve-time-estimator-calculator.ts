// @ts-nocheck
// Auto-generated from learning-curve-time-estimator-calculator-schema.json
import * as z from 'zod';

export interface Learning_curve_time_estimator_calculatorInput {
  first_unit_time: number;
  learning_rate: number;
  cumulative_units: number;
  target_units: number;
  shift_length: number;
  learning_model: string;
  include_break_in: boolean;
  break_in_penalty: number;
}

export const Learning_curve_time_estimator_calculatorInputSchema = z.object({
  first_unit_time: z.number().min(0.1).max(10000).default(100),
  learning_rate: z.number().min(50).max(100).default(85),
  cumulative_units: z.number().min(1).max(1000000).default(100),
  target_units: z.number().min(1).max(1000000).default(200),
  shift_length: z.number().min(1).max(24).default(8),
  learning_model: z.enum(['wright', 'crawford', 'dejong']).default('wright'),
  include_break_in: z.boolean().default(false),
  break_in_penalty: z.number().min(0).max(50).default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Learning_curve_time_estimator_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.first_unit_time + input.learning_rate + input.cumulative_units; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.first_unit_time + input.learning_rate + input.cumulative_units; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLearning_curve_time_estimator_calculator(input: Learning_curve_time_estimator_calculatorInput): Learning_curve_time_estimator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-scenario comparison"],
  };
}


export interface Learning_curve_time_estimator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
