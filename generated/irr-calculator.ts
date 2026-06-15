// Auto-generated from irr-calculator-schema.json
import * as z from 'zod';

export interface Irr_calculatorInput {
  initial_investment: number;
  annual_cash_inflow: number;
  project_life_years: number;
  discount_rate: number;
  terminal_value: number;
  cash_flow_variability: string;
  lean_six_sigma_adjustment: boolean;
}

export const Irr_calculatorInputSchema = z.object({
  initial_investment: z.number().min(0).max(1000000000).default(100000),
  annual_cash_inflow: z.number().min(0).max(1000000000).default(25000),
  project_life_years: z.number().min(1).max(50).default(5),
  discount_rate: z.number().min(0).max(100).default(10),
  terminal_value: z.number().min(0).max(1000000000).default(0),
  cash_flow_variability: z.enum(['low', 'medium', 'high']).default('medium'),
  lean_six_sigma_adjustment: z.boolean().default(false),
});

function evaluateAllFormulas(input: Irr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["adjusted_cash_flow"] = 0;
  results["net_present_value"] = 0;
  results["internal_rate_of_return"] = 0;
  try { results["payback_period"] = input.initial_investment / (results["adjusted_cash_flow"] ?? 0); } catch { results["payback_period"] = 0; }
  results["discounted_payback_period"] = 0;
  results["profitability_index"] = 0;
  results["data_confidence_factor"] = 0;
  return results;
}


export function calculateIrr_calculator(input: Irr_calculatorInput): Irr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["irr"] ?? 0;
  const breakdown = {
    net_present_value: values["net_present_value"] ?? 0,
    payback_period: values["payback_period"] ?? 0,
    discounted_payback_period: values["discounted_payback_period"] ?? 0,
    profitability_index: values["profitability_index"] ?? 0,
    adjusted_cash_flow: values["adjusted_cash_flow"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Process Waste (Lean)","Variability Risk Premium","Opportunity Cost of Capital"];
  const suggestedActions: string[] = ["Consider reducing initial investment, increasing cash inflows, or extending project life.","Implement Six Sigma DMAIC to reduce cash flow variability and improve confidence.","Enable Lean Six Sigma adjustment to identify and eliminate process waste.","Run sensitivity analysis on discount rate and cash inflows to assess robustness."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Sensitivity analysis","Multi-scenario comparison","Audit trail logging"],
  };
}


export interface Irr_calculatorOutput {
  totalWasteCost: number;
  breakdown: { net_present_value: number; payback_period: number; discounted_payback_period: number; profitability_index: number; adjusted_cash_flow: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
