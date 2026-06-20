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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Learning_curve_time_estimator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.first_unit_time * (input.learning_rate / 100) * input.cumulative_units * input.target_units; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.first_unit_time * (input.learning_rate / 100) * input.cumulative_units * input.target_units * (input.shift_length * (input.break_in_penalty / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.shift_length * (input.break_in_penalty / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateLearning_curve_time_estimator_calculator(input: Learning_curve_time_estimator_calculatorInput): Learning_curve_time_estimator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "%",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-scenario comparison"],
  };
}


export interface Learning_curve_time_estimator_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Learning_curve_time_estimator_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

