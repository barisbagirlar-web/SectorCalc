// Auto-generated from reaction-quotient-hesaplama-schema.json
import * as z from 'zod';

export interface Reaction_quotient_hesaplamaInput {
  correctAnswers: number;
  totalQuestions: number;
  dataConfidence?: number;
}

export const Reaction_quotient_hesaplamaInputSchema = z.object({
  correctAnswers: z.number().min(0).default(100),
  totalQuestions: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Reaction_quotient_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.correctAnswers * Math.exp(-input.totalQuestions / 100) + input.correctAnswers * input.totalQuestions / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.correctAnswers * Math.exp(-input.totalQuestions / 100) + input.correctAnswers * input.totalQuestions / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateReaction_quotient_hesaplama(input: Reaction_quotient_hesaplamaInput): Reaction_quotient_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Reaction_quotient_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Reaction_quotient_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "n",
  breakdownKeys: ["result"],
} as const;

