// @ts-nocheck
// Auto-generated from time-study-analyzer-calculator-schema.json
import * as z from 'zod';

export interface Time_study_analyzer_calculatorInput {
  observed_time: number;
  performance_rating: number;
  allowance_percentage: number;
  frequency_per_cycle: number;
  work_measurement_method: string;
  include_learning_curve: boolean;
}

export const Time_study_analyzer_calculatorInputSchema = z.object({
  observed_time: z.number().min(1).max(3600).default(60),
  performance_rating: z.number().min(50).max(150).default(100),
  allowance_percentage: z.number().min(0).max(50).default(15),
  frequency_per_cycle: z.number().min(0.1).max(100).default(1),
  work_measurement_method: z.enum(['Stopwatch', 'Predetermined Motion Time', 'Work Sampling', 'Standard Data']).default('Stopwatch'),
  include_learning_curve: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Time_study_analyzer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.observed_time + input.performance_rating + input.allowance_percentage; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.observed_time + input.performance_rating + input.allowance_percentage; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTime_study_analyzer_calculator(input: Time_study_analyzer_calculatorInput): Time_study_analyzer_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-operator comparison","Custom performance rating"],
  };
}


export interface Time_study_analyzer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
