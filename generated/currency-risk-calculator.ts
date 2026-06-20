// Auto-generated from currency-risk-calculator-schema.json
import * as z from 'zod';

export interface Currency_risk_calculatorInput {
  exposure_amount: number;
  volatility_annual: number;
  confidence_level: string;
  hedge_ratio: number;
  time_horizon_days: number;
  enable_lean_adjustment: boolean;
  dataConfidence?: number;
}

export const Currency_risk_calculatorInputSchema = z.object({
  exposure_amount: z.number().min(1000).max(1000000000).default(1000000),
  volatility_annual: z.number().min(0.5).max(50).default(8.5),
  confidence_level: z.enum(['90', '95', '99']).default('95'),
  hedge_ratio: z.number().min(0).max(100).default(50),
  time_horizon_days: z.number().min(1).max(365).default(30),
  enable_lean_adjustment: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Currency_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.enable_lean_adjustment * input.exposure_amount; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.enable_lean_adjustment * input.exposure_amount * (1 + (input.volatility_annual / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.enable_lean_adjustment * input.exposure_amount * (1 + (input.volatility_annual / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCurrency_risk_calculator(input: Currency_risk_calculatorInput): Currency_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"])
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-currency portfolio optimization"],
  };
}


export interface Currency_risk_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Currency_risk_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost"],
} as const;

