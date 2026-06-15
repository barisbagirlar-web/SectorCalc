// Auto-generated from currency-risk-calculator-schema.json
import * as z from 'zod';

export interface Currency_risk_calculatorInput {
  exposure_amount: number;
  volatility_annual: number;
  confidence_level: string;
  hedge_ratio: number;
  time_horizon_days: number;
  enable_lean_adjustment: boolean;
}

export const Currency_risk_calculatorInputSchema = z.object({
  exposure_amount: z.number().min(1000).max(1000000000).default(1000000),
  volatility_annual: z.number().min(0.5).max(50).default(8.5),
  confidence_level: z.enum(['90', '95', '99']).default('95'),
  hedge_ratio: z.number().min(0).max(100).default(50),
  time_horizon_days: z.number().min(1).max(365).default(30),
  enable_lean_adjustment: z.boolean().default(true),
});

function evaluateAllFormulas(input: Currency_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["daily_volatility"] = input.volatility_annual / 100 / Math.sqrt(252); } catch { results["daily_volatility"] = 0; }
  results["z_score"] = 0;
  try { results["lean_adjustment_factor"] = input.enable_lean_adjustment ? 1.0 + (0.1 * (1 - input.hedge_ratio/100)) : 1.0; } catch { results["lean_adjustment_factor"] = 0; }
  try { results["value_at_risk"] = input.exposure_amount * (1 - exp(-(results["z_score"] ?? 0) * (results["daily_volatility"] ?? 0) * Math.sqrt(input.time_horizon_days) * (results["lean_adjustment_factor"] ?? 0))); } catch { results["value_at_risk"] = 0; }
  try { results["expected_shortfall"] = (results["value_at_risk"] ?? 0) * (1 + 0.2 * (1 - input.hedge_ratio/100)); } catch { results["expected_shortfall"] = 0; }
  try { results["hedge_effectiveness"] = input.hedge_ratio / 100 * (1 - (results["daily_volatility"] ?? 0) * 0.5); } catch { results["hedge_effectiveness"] = 0; }
  try { results["primaryResult"] = 0.6 * (results["value_at_risk"] ?? 0) + 0.4 * (results["expected_shortfall"] ?? 0); } catch { results["primaryResult"] = 0; }
  return results;
}


export function calculateCurrency_risk_calculator(input: Currency_risk_calculatorInput): Currency_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryResult"] ?? 0;
  const breakdown = {
    valueAtRisk: values["valueAtRisk"] ?? 0,
    expectedShortfall: values["expectedShortfall"] ?? 0,
    hedgeEffectiveness: values["hedgeEffectiveness"] ?? 0,
    dailyVolatility: values["dailyVolatility"] ?? 0,
    zScore: values["zScore"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unhedged residual exposure (1 - hedge_ratio) * exposure_amount","Volatility clustering – potential regime shift not captured by constant volatility","Basis risk between spot and forward rates","Liquidity risk in exotic currency pairs"];
  const suggestedActions: string[] = ["Increase hedge ratio to at least 70% to reduce tail risk","Implement rolling hedge program to smooth execution costs","Use options collar strategy to limit downside while retaining upside","Monitor macroeconomic indicators (interest rate differentials, trade balances)"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-currency portfolio optimization"],
  };
}


export interface Currency_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: { valueAtRisk: number; expectedShortfall: number; hedgeEffectiveness: number; dailyVolatility: number; zScore: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
