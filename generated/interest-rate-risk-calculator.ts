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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Interest_rate_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rate_change * input.portfolio_value; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.rate_change * input.portfolio_value * (1 + (input.current_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.rate_change * input.portfolio_value * (1 + (input.current_rate / 100)) * (input.duration); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.duration; results["factor_duration"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_duration"] = Number.NaN; }
  return results;
}


export function calculateInterest_rate_risk_calculator(input: Interest_rate_risk_calculatorInput): Interest_rate_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Sensitivity heatmap"],
  };
}


export interface Interest_rate_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
