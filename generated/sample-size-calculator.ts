// Auto-generated from sample-size-calculator-schema.json
import * as z from 'zod';

export interface Sample_size_calculatorInput {
  mean1: number;
  mean2: number;
  pooledStdDev: number;
  confidenceLevel: number;
  power: number;
  groups: number;
  icc: number;
  clusterSize: number;
  dataConfidence?: number;
}

export const Sample_size_calculatorInputSchema = z.object({
  mean1: z.number().min(0).default(0),
  mean2: z.number().min(0).default(0),
  pooledStdDev: z.number().min(0).default(0),
  confidenceLevel: z.number().min(0).default(0),
  power: z.number().min(0).default(0),
  groups: z.number().min(0).default(0),
  icc: z.number().min(0).default(0),
  clusterSize: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sample_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mean1 * input.mean2 * input.pooledStdDev * (input.confidenceLevel / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.mean1 * input.mean2 * input.pooledStdDev * (input.confidenceLevel / 100) * ((input.power / 100) * input.groups * input.icc * input.clusterSize); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.power / 100) * input.groups * input.icc * input.clusterSize; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateSample_size_calculator(input: Sample_size_calculatorInput): Sample_size_calculatorOutput {
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


export interface Sample_size_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sample_size_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

