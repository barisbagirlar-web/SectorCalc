// Auto-generated from regression-analyzer-schema.json
import * as z from 'zod';

export interface Regression_analyzerInput {
  xMatrix: number;
  yVector: number;
  confidenceLevel: number;
  dataConfidence?: number;
}

export const Regression_analyzerInputSchema = z.object({
  xMatrix: z.number().min(0).default(0),
  yVector: z.number().min(0).default(0),
  confidenceLevel: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Regression_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.xMatrix * input.yVector * (input.confidenceLevel / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.xMatrix * input.yVector * (input.confidenceLevel / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateRegression_analyzer(input: Regression_analyzerInput): Regression_analyzerOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Regression_analyzerOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Regression_analyzerOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product"],
} as const;

