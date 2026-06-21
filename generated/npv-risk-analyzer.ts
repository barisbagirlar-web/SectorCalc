// Auto-generated from npv-risk-analyzer-schema.json
import * as z from 'zod';

export interface Npv_risk_analyzerInput {
  cashFlows: number;
  equityCost: number;
  debtCost: number;
  taxRate: number;
  debtToEquity: number;
  riskFreeRate: number;
  probabilityArray: number;
  riskPremium: number;
  dataConfidence?: number;
}

export const Npv_risk_analyzerInputSchema = z.object({
  cashFlows: z.number().min(0).default(0),
  equityCost: z.number().min(0).default(0),
  debtCost: z.number().min(0).default(0),
  taxRate: z.number().min(0).default(0),
  debtToEquity: z.number().min(0).default(0),
  riskFreeRate: z.number().min(0).default(0),
  probabilityArray: z.number().min(0).default(0),
  riskPremium: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Npv_risk_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.debtToEquity * input.cashFlows; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.debtToEquity * input.cashFlows * (1 + (input.equityCost / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.debtToEquity * input.cashFlows * (1 + (input.equityCost / 100)) * ((input.debtCost / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.debtCost / 100); results["factor_debtCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_debtCost"] = Number.NaN; }
  return results;
}


export function calculateNpv_risk_analyzer(input: Npv_risk_analyzerInput): Npv_risk_analyzerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_debtCost: toNumericFormulaValue(values["factor_debtCost"])
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


export interface Npv_risk_analyzerOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_debtCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Npv_risk_analyzerOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_debtCost"],
} as const;

