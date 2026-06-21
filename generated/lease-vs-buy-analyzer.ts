// Auto-generated from lease-vs-buy-analyzer-schema.json
import * as z from 'zod';

export interface Lease_vs_buy_analyzerInput {
  purchasePrice: number;
  leasePayment: number;
  depreciationSchedule: number;
  salvageValue: number;
  taxRate: number;
  interestRate: number;
  assetLife: number;
  dataConfidence?: number;
}

export const Lease_vs_buy_analyzerInputSchema = z.object({
  purchasePrice: z.number().min(0).default(0),
  leasePayment: z.number().min(0).default(0),
  depreciationSchedule: z.number().min(0).default(0),
  salvageValue: z.number().min(0).default(0),
  taxRate: z.number().min(0).default(0),
  interestRate: z.number().min(0).default(0),
  assetLife: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lease_vs_buy_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.assetLife * input.purchasePrice; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.assetLife * input.purchasePrice * (1 + (input.taxRate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.assetLife * input.purchasePrice * (1 + (input.taxRate / 100)) * (input.leasePayment); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.leasePayment; results["factor_leasePayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_leasePayment"] = Number.NaN; }
  return results;
}


export function calculateLease_vs_buy_analyzer(input: Lease_vs_buy_analyzerInput): Lease_vs_buy_analyzerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_leasePayment: toNumericFormulaValue(values["factor_leasePayment"])
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


export interface Lease_vs_buy_analyzerOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_leasePayment: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lease_vs_buy_analyzerOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_leasePayment"],
} as const;

