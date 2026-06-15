// Auto-generated from interest-rate-risk-calculator-schema.json
import * as z from 'zod';

export interface Interest_rate_risk_calculatorInput {
  current_rate: number;
  rate_change: number;
  portfolio_value: number;
  duration: number;
  convexity: number;
  hedge_ratio: number;
  confidence_level: string;
  volatility_regime: string;
}

export const Interest_rate_risk_calculatorInputSchema = z.object({
  current_rate: z.number().min(0).max(30).default(5),
  rate_change: z.number().min(-500).max(500).default(50),
  portfolio_value: z.number().min(1000).max(10000000000).default(10000000),
  duration: z.number().min(0.1).max(30).default(4.5),
  convexity: z.number().min(0).max(500).default(25),
  hedge_ratio: z.number().min(0).max(100).default(60),
  confidence_level: z.enum(['90%', '95%', '99%']).default('95%'),
  volatility_regime: z.enum(['low', 'normal', 'high', 'extreme']).default('normal'),
});

function evaluateAllFormulas(input: Interest_rate_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["price_change_duration"] = ΔP_dur = -input.duration * (input.rate_change / 10000) * input.portfolio_value; } catch { results["price_change_duration"] = 0; }
  try { results["price_change_convexity"] = ΔP_conv = 0.5 * input.convexity * (input.rate_change / 10000)**2 * input.portfolio_value; } catch { results["price_change_convexity"] = 0; }
  try { results["total_price_change"] = ΔP_total = ΔP_dur + ΔP_conv; } catch { results["total_price_change"] = 0; }
  try { results["hedged_price_change"] = ΔP_hedged = ΔP_total * (1 - input.hedge_ratio / 100); } catch { results["hedged_price_change"] = 0; }
  results["value_at_risk"] = 0;
  try { results["data_confidence_adjustment"] = ΔP_hedged * (1 - 0.1 * (volatility_regime_index)); } catch { results["data_confidence_adjustment"] = 0; }
  try { results["primary_result"] = DCA; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateInterest_rate_risk_calculator(input: Interest_rate_risk_calculatorInput): Interest_rate_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["net_interest_rate_risk_exposure"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    type: values["type"] ?? 0,
    properties: values["properties"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Assumes all maturities shift equally; non-parallel shifts may cause additional basis risk.","In stressed markets, liquidity premiums may erode, amplifying losses beyond duration/convexity estimates.","Hedge effectiveness may degrade if counterparty defaults or collateral calls are missed.","Bonds with embedded options have negative convexity at certain yield levels, not captured by standard convexity."];
  const suggestedActions: string[] = ["Increase hedge ratio to 80% if volatility regime is high or extreme.","Diversify into floating-rate notes to reduce duration exposure.","Implement interest rate swaps to lock in current rates for 6-12 months.","Conduct scenario analysis for non-parallel yield curve shifts (e.g., steepening/flattening).","Review counterparty credit limits and collateral agreements for hedge positions."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Sensitivity heatmap"],
  };
}


export interface Interest_rate_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; type: number; properties: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
