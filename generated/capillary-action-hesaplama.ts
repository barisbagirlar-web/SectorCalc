// Auto-generated from capillary-action-hesaplama-schema.json
import * as z from 'zod';

export interface Capillary_action_hesaplamaInput {
  correctAnswers: number;
  dataConfidence?: number;
}

export const Capillary_action_hesaplamaInputSchema = z.object({
  correctAnswers: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Capillary_action_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.correctAnswers * (1 + input.correctAnswers/500) + Math.sqrt(input.correctAnswers) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.correctAnswers * (1 + input.correctAnswers/500) + Math.sqrt(input.correctAnswers) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCapillary_action_hesaplama(input: Capillary_action_hesaplamaInput): Capillary_action_hesaplamaOutput {
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
    unit: "n",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Capillary_action_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Capillary_action_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "n",
  breakdownKeys: ["result"],
} as const;

