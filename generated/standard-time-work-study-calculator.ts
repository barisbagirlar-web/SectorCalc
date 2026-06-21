// Auto-generated from standard-time-work-study-calculator-schema.json
import * as z from 'zod';

export interface Standard_time_work_study_calculatorInput {
  cycleTimes: number;
  performanceRating: number;
  pfdAllowance: number;
  fatigueAllowance: number;
  delayAllowance: number;
  n: number;
  confidenceLevelZ: number;
  sampleStdDev: number;
  accuracyA: number;
  sampleMean: number;
  shiftTime: number;
  dataConfidence?: number;
}

export const Standard_time_work_study_calculatorInputSchema = z.object({
  cycleTimes: z.number().min(0).default(0),
  performanceRating: z.number().min(0).default(0),
  pfdAllowance: z.number().min(0).default(0),
  fatigueAllowance: z.number().min(0).default(0),
  delayAllowance: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  confidenceLevelZ: z.number().min(0).default(0),
  sampleStdDev: z.number().min(0).default(0),
  accuracyA: z.number().min(0).default(0),
  sampleMean: z.number().min(0).default(0),
  shiftTime: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Standard_time_work_study_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycleTimes * (input.performanceRating / 100) * (input.pfdAllowance / 100) * (input.fatigueAllowance / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.cycleTimes * (input.performanceRating / 100) * (input.pfdAllowance / 100) * (input.fatigueAllowance / 100) * ((input.delayAllowance / 100) * input.n * input.confidenceLevelZ * input.sampleStdDev * (input.accuracyA / 100) * input.sampleMean * input.shiftTime); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.delayAllowance / 100) * input.n * input.confidenceLevelZ * input.sampleStdDev * (input.accuracyA / 100) * input.sampleMean * input.shiftTime; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateStandard_time_work_study_calculator(input: Standard_time_work_study_calculatorInput): Standard_time_work_study_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Standard_time_work_study_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Standard_time_work_study_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

