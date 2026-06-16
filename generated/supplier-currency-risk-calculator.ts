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

function evaluateAllFormulas(input: Supplier_currency_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.contract_value * (input.foreign_exposure_pct / 100); results["exposed_amount"] = Number.isFinite(v) ? v : 0; } catch { results["exposed_amount"] = 0; }
  try { const v = (results["exposed_amount"] ?? 0) * (1 - input.hedge_ratio / 100); results["unhedged_exposure"] = Number.isFinite(v) ? v : 0; } catch { results["unhedged_exposure"] = 0; }
  try { const v = (input.confidence_level === '90' ? 1.282 : (input.confidence_level === '95' ? 1.645 : (input.confidence_level === '99' ? 2.326 : 1.645))); results["var_factor"] = Number.isFinite(v) ? v : 0; } catch { results["var_factor"] = 0; }
  try { const v = input.volatility_annual / 100 * Math.sqrt(input.time_horizon_months / 12); results["time_adjusted_volatility"] = Number.isFinite(v) ? v : 0; } catch { results["time_adjusted_volatility"] = 0; }
  try { const v = (results["unhedged_exposure"] ?? 0) * (results["var_factor"] ?? 0) * (results["time_adjusted_volatility"] ?? 0); results["var_unhedged"] = Number.isFinite(v) ? v : 0; } catch { results["var_unhedged"] = 0; }
  try { const v = (input.supplier_credit_rating === 'AAA' ? 0.001 : (input.supplier_credit_rating === 'AA' ? 0.003 : (input.supplier_credit_rating === 'A' ? 0.005 : (input.supplier_credit_rating === 'BBB' ? 0.01 : (input.supplier_credit_rating === 'BB' ? 0.02 : (input.supplier_credit_rating === 'B' ? 0.04 : (input.supplier_credit_rating === 'CCC' ? 0.08 : 0.01))))))); results["credit_risk_premium"] = Number.isFinite(v) ? v : 0; } catch { results["credit_risk_premium"] = 0; }
  results["primary_result"] = 0;
  return results;
}


export function calculateSupplier_currency_risk_calculator(input: Supplier_currency_risk_calculatorInput): Supplier_currency_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary_result"] ?? 0;
  const breakdown = {
    exposed_amount: values["exposed_amount"] ?? 0,
    unhedged_exposure: values["unhedged_exposure"] ?? 0,
    var_unhedged: values["var_unhedged"] ?? 0,
    credit_risk_premium: values["credit_risk_premium"] ?? 0,
    time_adjusted_volatility: values["time_adjusted_volatility"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Basis Risk from Imperfect Hedging","Liquidity Risk in Illiquid Currency Pairs","Operational Risk (Settlement Delays)"];
  const suggestedActions: string[] = ["Increase Hedge Ratio","Diversify Currency Exposure","Implement Rolling Hedges","Request Credit Insurance"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Automated alerting"],
  };
}


export interface Supplier_currency_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: { exposed_amount: number; unhedged_exposure: number; var_unhedged: number; credit_risk_premium: number; time_adjusted_volatility: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
