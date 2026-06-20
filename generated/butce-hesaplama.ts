// Auto-generated from butce-hesaplama-schema.json
import * as z from 'zod';

export interface Butce_hesaplamaInput {
  income: number;
  expenses: number;
  dataConfidence?: number;
}

export const Butce_hesaplamaInputSchema = z.object({
  income: z.number().min(0).default(5000),
  expenses: z.number().min(0).default(3500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Butce_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.income - input.expenses; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.income - input.expenses; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateButce_hesaplama(input: Butce_hesaplamaInput): Butce_hesaplamaOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Butce_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Butce_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["result"],
} as const;

