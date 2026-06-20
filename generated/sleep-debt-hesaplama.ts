// Auto-generated from sleep-debt-hesaplama-schema.json
import * as z from 'zod';

export interface Sleep_debt_hesaplamaInput {
  stressScore: number;
  dataConfidence?: number;
}

export const Sleep_debt_hesaplamaInputSchema = z.object({
  stressScore: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sleep_debt_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stressScore * (1 + input.stressScore/500) + Math.sqrt(input.stressScore) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.stressScore * (1 + input.stressScore/500) + Math.sqrt(input.stressScore) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSleep_debt_hesaplama(input: Sleep_debt_hesaplamaInput): Sleep_debt_hesaplamaOutput {
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


export interface Sleep_debt_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sleep_debt_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "points",
  breakdownKeys: ["result"],
} as const;

