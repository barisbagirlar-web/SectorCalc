// Auto-generated from time-study-analyzer-calculator-schema.json
import * as z from 'zod';

export interface Time_study_analyzer_calculatorInput {
  observed_time: number;
  performance_rating: number;
  allowance_percentage: number;
  frequency_per_cycle: number;
  work_measurement_method: string;
  include_learning_curve: boolean;
  dataConfidence?: number;
}

export const Time_study_analyzer_calculatorInputSchema = z.object({
  observed_time: z.number().min(1).max(3600).default(60),
  performance_rating: z.number().min(50).max(150).default(100),
  allowance_percentage: z.number().min(0).max(50).default(15),
  frequency_per_cycle: z.number().min(0.1).max(100).default(1),
  work_measurement_method: z.enum(['Stopwatch', 'Predetermined Motion Time', 'Work Sampling', 'Standard Data']).default('Stopwatch'),
  include_learning_curve: z.boolean().default(false),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Time_study_analyzer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.observed_time * (input.performance_rating / 100) * (input.allowance_percentage / 100) * input.frequency_per_cycle; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.observed_time * (input.performance_rating / 100) * (input.allowance_percentage / 100) * input.frequency_per_cycle; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateTime_study_analyzer_calculator(input: Time_study_analyzer_calculatorInput): Time_study_analyzer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"])
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-operator comparison","Custom performance rating"],
  };
}


export interface Time_study_analyzer_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Time_study_analyzer_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product"],
} as const;

