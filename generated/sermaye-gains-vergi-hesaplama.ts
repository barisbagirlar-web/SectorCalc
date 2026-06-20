// Auto-generated from sermaye-gains-vergi-hesaplama-schema.json
import * as z from 'zod';

export interface Sermaye_gains_vergi_hesaplamaInput {
  income: number;
  deductions: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Sermaye_gains_vergi_hesaplamaInputSchema = z.object({
  income: z.number().min(0).default(80000),
  deductions: z.number().min(0).default(10000),
  taxRate: z.number().min(0).max(100).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sermaye_gains_vergi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.income - input.deductions) * (1 - input.taxRate/100); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = (input.income - input.deductions) * (1 - input.taxRate/100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSermaye_gains_vergi_hesaplama(input: Sermaye_gains_vergi_hesaplamaInput): Sermaye_gains_vergi_hesaplamaOutput {
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


export interface Sermaye_gains_vergi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sermaye_gains_vergi_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["result"],
} as const;

