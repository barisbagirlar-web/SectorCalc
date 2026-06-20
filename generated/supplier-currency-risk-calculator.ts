// Auto-generated from supplier-currency-risk-calculator-schema.json
import * as z from 'zod';

export interface Supplier_currency_risk_calculatorInput {
  contract_value: number;
  foreign_exposure_pct: number;
  volatility_annual: number;
  hedge_ratio: number;
  time_horizon_months: number;
  confidence_level: string;
  supplier_credit_rating: string;
  use_iso_31000: boolean;
  dataConfidence?: number;
}

export const Supplier_currency_risk_calculatorInputSchema = z.object({
  contract_value: z.number().min(10000).max(1000000000).default(1000000),
  foreign_exposure_pct: z.number().min(0).max(100).default(50),
  volatility_annual: z.number().min(1).max(50).default(10),
  hedge_ratio: z.number().min(0).max(100).default(70),
  time_horizon_months: z.number().min(1).max(60).default(12),
  confidence_level: z.enum(['90', '95', '99']).default('95'),
  supplier_credit_rating: z.enum(['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC']).default('BBB'),
  use_iso_31000: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Supplier_currency_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.use_iso_31000 * input.contract_value; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.use_iso_31000 * input.contract_value * (1 + (input.foreign_exposure_pct / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.use_iso_31000 * input.contract_value * (1 + (input.foreign_exposure_pct / 100)) * ((input.volatility_annual / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.volatility_annual / 100); results["factor_volatility_annual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_volatility_annual"] = Number.NaN; }
  return results;
}


export function calculateSupplier_currency_risk_calculator(input: Supplier_currency_risk_calculatorInput): Supplier_currency_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_volatility_annual: toNumericFormulaValue(values["factor_volatility_annual"])
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Automated alerting"],
  };
}


export interface Supplier_currency_risk_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_volatility_annual: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Supplier_currency_risk_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_volatility_annual"],
} as const;

