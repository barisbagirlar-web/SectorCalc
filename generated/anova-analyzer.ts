// Auto-generated from anova-analyzer-schema.json
import * as z from 'zod';

export interface Anova_analyzerInput {
  groupData: number;
  alpha: number;
  qAlpha: number;
  nPerGroup: number;
  dataConfidence?: number;
}

export const Anova_analyzerInputSchema = z.object({
  groupData: z.number().min(0).default(0),
  alpha: z.number().min(0).default(0),
  qAlpha: z.number().min(0).default(0),
  nPerGroup: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Anova_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.groupData * input.alpha * input.qAlpha * input.nPerGroup; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.groupData * input.alpha * input.qAlpha * input.nPerGroup; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateAnova_analyzer(input: Anova_analyzerInput): Anova_analyzerOutput {
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Anova_analyzerOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Anova_analyzerOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product"],
} as const;

