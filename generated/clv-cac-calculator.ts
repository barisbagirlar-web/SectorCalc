// Auto-generated from clv-cac-calculator-schema.json
import * as z from 'zod';

export interface Clv_cac_calculatorInput {
  avg_order_value: number;
  purchase_frequency: number;
  customer_lifetime_years: number;
  gross_margin_pct: number;
  cac_total: number;
  retention_rate: number;
  discount_rate: number;
  data_confidence: string;
  include_churn_adjustment: boolean;
}

export const Clv_cac_calculatorInputSchema = z.object({
  avg_order_value: z.number().min(1).max(100000).default(50),
  purchase_frequency: z.number().min(0.5).max(365).default(4),
  customer_lifetime_years: z.number().min(0.5).max(50).default(3),
  gross_margin_pct: z.number().min(0).max(100).default(40),
  cac_total: z.number().min(1).max(100000).default(200),
  retention_rate: z.number().min(0).max(100).default(70),
  discount_rate: z.number().min(0).max(50).default(10),
  data_confidence: z.enum(['low', 'medium', 'high']).default('medium'),
  include_churn_adjustment: z.boolean().default(true),
});

function evaluateAllFormulas(input: Clv_cac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["annual_revenue_per_customer"] = input.avg_order_value * input.purchase_frequency; } catch { results["annual_revenue_per_customer"] = 0; }
  try { results["churn_rate"] = 1 - (input.retention_rate / 100); } catch { results["churn_rate"] = 0; }
  results["adjusted_lifetime_years"] = 0;
  try { results["clv_gross"] = (results["annual_revenue_per_customer"] ?? 0) * (results["adjusted_lifetime_years"] ?? 0); } catch { results["clv_gross"] = 0; }
  try { results["clv_net"] = (results["clv_gross"] ?? 0) * (input.gross_margin_pct / 100) * (1 - Math.pow(1 + input.discount_rate/100, -(results["adjusted_lifetime_years"] ?? 0))) / (input.discount_rate/100); } catch { results["clv_net"] = 0; }
  try { results["clv_cac_ratio"] = (results["clv_net"] ?? 0) / input.cac_total; } catch { results["clv_cac_ratio"] = 0; }
  try { results["payback_months"] = (input.cac_total / ((results["annual_revenue_per_customer"] ?? 0) * (input.gross_margin_pct/100))) * 12; } catch { results["payback_months"] = 0; }
  return results;
}


export function calculateClv_cac_calculator(input: Clv_cac_calculatorInput): Clv_cac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["clv_cac_ratio"] ?? 0;
  const breakdown = {
    annual_revenue_per_customer: values["annual_revenue_per_customer"] ?? 0,
    churn_rate_pct: values["churn_rate_pct"] ?? 0,
    adjusted_lifetime_years: values["adjusted_lifetime_years"] ?? 0,
    clv_gross: values["clv_gross"] ?? 0,
    clv_net: values["clv_net"] ?? 0,
    cac_total: values["cac_total"] ?? 0,
    payback_months: values["payback_months"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Churn Rate","Low Gross Margin","Long Payback Period","High Discount Rate"];
  const suggestedActions: string[] = ["Improve Retention Rate","Reduce Customer Acquisition Cost","Increase Average Order Value","Improve Gross Margin"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Benchmarking against industry standards (WERC, Lean Six Sigma)","Automated alerting via email"],
  };
}


export interface Clv_cac_calculatorOutput {
  totalWasteCost: number;
  breakdown: { annual_revenue_per_customer: number; churn_rate_pct: number; adjusted_lifetime_years: number; clv_gross: number; clv_net: number; cac_total: number; payback_months: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
