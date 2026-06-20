// Auto-generated from training-stress-score-hesaplama-schema.json
import * as z from 'zod';

export interface Training_stress_score_hesaplamaInput {
  stressScore: number;
  dataConfidence?: number;
}

export const Training_stress_score_hesaplamaInputSchema = z.object({
  stressScore: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Training_stress_score_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(input.stressScore / 100, 2) * 100 + Math.sqrt(input.stressScore) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = Math.pow(input.stressScore / 100, 2) * 100 + Math.sqrt(input.stressScore) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateTraining_stress_score_hesaplama(input: Training_stress_score_hesaplamaInput): Training_stress_score_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "points",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Training_stress_score_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Training_stress_score_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "points",
  breakdownKeys: ["result"],
} as const;

