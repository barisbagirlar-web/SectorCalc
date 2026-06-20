// Auto-generated from contribution-marj-hesaplama-schema.json
import * as z from 'zod';

export interface Contribution_marj_hesaplamaInput {
  revenueAmount: number;
  costAmount: number;
  dataConfidence?: number;
}

export const Contribution_marj_hesaplamaInputSchema = z.object({
  revenueAmount: z.number().min(0).default(100),
  costAmount: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Contribution_marj_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenueAmount / input.costAmount * 100 + Math.sqrt(input.revenueAmount * input.costAmount) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.revenueAmount / input.costAmount * 100 + Math.sqrt(input.revenueAmount * input.costAmount) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateContribution_marj_hesaplama(input: Contribution_marj_hesaplamaInput): Contribution_marj_hesaplamaOutput {
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
    unit: "currency",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Contribution_marj_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Contribution_marj_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "currency",
  breakdownKeys: ["result"],
} as const;

