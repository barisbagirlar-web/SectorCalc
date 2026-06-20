// Auto-generated from abd-federal-gelir-vergisi-hesaplayici-schema.json
import * as z from 'zod';

export interface Abd_federal_gelir_vergisi_hesaplayiciInput {
  income: number;
  deductions: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Abd_federal_gelir_vergisi_hesaplayiciInputSchema = z.object({
  income: z.number().min(0).default(80000),
  deductions: z.number().min(0).default(10000),
  taxRate: z.number().min(0).max(100).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Abd_federal_gelir_vergisi_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.income - input.deductions) * (1 - input.taxRate/100); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = (input.income - input.deductions) * (1 - input.taxRate/100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateAbd_federal_gelir_vergisi_hesaplayici(input: Abd_federal_gelir_vergisi_hesaplayiciInput): Abd_federal_gelir_vergisi_hesaplayiciOutput {
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


export interface Abd_federal_gelir_vergisi_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Abd_federal_gelir_vergisi_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["result"],
} as const;

