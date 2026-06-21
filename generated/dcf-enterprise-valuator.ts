// Auto-generated from dcf-enterprise-valuator-schema.json
import * as z from 'zod';

export interface Dcf_enterprise_valuatorInput {
  ebitArray: number;
  taxRate: number;
  daArray: number;
  capexArray: number;
  nwcChangeArray: number;
  wacc: number;
  terminalGrowth: number;
  exitMultiple: number;
  debt: number;
  cash: number;
  sharesOutstanding: number;
  dataConfidence?: number;
}

export const Dcf_enterprise_valuatorInputSchema = z.object({
  ebitArray: z.number().min(0).default(0),
  taxRate: z.number().min(0).default(0),
  daArray: z.number().min(0).default(0),
  capexArray: z.number().min(0).default(0),
  nwcChangeArray: z.number().min(0).default(0),
  wacc: z.number().min(0).default(0),
  terminalGrowth: z.number().min(0).default(0),
  exitMultiple: z.number().min(0).default(0),
  debt: z.number().min(0).default(0),
  cash: z.number().min(0).default(0),
  sharesOutstanding: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dcf_enterprise_valuatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.exitMultiple * input.ebitArray; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.exitMultiple * input.ebitArray * (1 + (input.taxRate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.exitMultiple * input.ebitArray * (1 + (input.taxRate / 100)) * (input.daArray * input.capexArray * input.nwcChangeArray); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.daArray; results["factor_daArray"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_daArray"] = Number.NaN; }
  try { const v = input.capexArray; results["factor_capexArray"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_capexArray"] = Number.NaN; }
  try { const v = input.nwcChangeArray; results["factor_nwcChangeArray"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_nwcChangeArray"] = Number.NaN; }
  return results;
}


export function calculateDcf_enterprise_valuator(input: Dcf_enterprise_valuatorInput): Dcf_enterprise_valuatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_daArray: toNumericFormulaValue(values["factor_daArray"]),
    factor_capexArray: toNumericFormulaValue(values["factor_capexArray"]),
    factor_nwcChangeArray: toNumericFormulaValue(values["factor_nwcChangeArray"])
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Dcf_enterprise_valuatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_daArray: number; factor_capexArray: number; factor_nwcChangeArray: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dcf_enterprise_valuatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_daArray","factor_capexArray","factor_nwcChangeArray"],
} as const;

