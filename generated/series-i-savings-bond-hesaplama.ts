// Auto-generated from series-i-savings-bond-hesaplama-schema.json
import * as z from 'zod';

export interface Series_i_savings_bond_hesaplamaInput {
  principal: number;
  annualRate: number;
  dataConfidence?: number;
}

export const Series_i_savings_bond_hesaplamaInputSchema = z.object({
  principal: z.number().min(0).default(100),
  annualRate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Series_i_savings_bond_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal / input.annualRate * 100 + Math.sqrt(input.principal * input.annualRate) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.principal / input.annualRate * 100 + Math.sqrt(input.principal * input.annualRate) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSeries_i_savings_bond_hesaplama(input: Series_i_savings_bond_hesaplamaInput): Series_i_savings_bond_hesaplamaOutput {
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


export interface Series_i_savings_bond_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Series_i_savings_bond_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "currency",
  breakdownKeys: ["result"],
} as const;

