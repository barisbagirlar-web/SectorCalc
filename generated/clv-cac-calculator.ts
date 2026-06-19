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
  dataConfidence?: number;
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
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Clv_cac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchase_frequency * input.avg_order_value; results["annual_revenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_revenue"] = 0; }
  try { const v = input.purchase_frequency * input.avg_order_value * (input.gross_margin_pct / 100); results["annual_gross_profit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_gross_profit"] = 0; }
  try { const v = input.purchase_frequency * input.avg_order_value * (input.gross_margin_pct / 100) * input.customer_lifetime_years; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (asFormulaNumber(results["result"])) / input.cac_total; results["clv_cac_ratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["clv_cac_ratio"] = 0; }
  try { const v = 100 - input.retention_rate; results["churn_rate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["churn_rate"] = 0; }
  try { const v = input.cac_total / (input.purchase_frequency * input.avg_order_value * input.gross_margin_pct / 100 / 12); results["payback_months"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["payback_months"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateClv_cac_calculator(input: Clv_cac_calculatorInput): Clv_cac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Customer churn beyond modeled retention rate","Unpaid referrals and word-of-mouth value not captured","Cross-sell and upsell revenue not included"];
  const suggestedActions: string[] = ["Increase retention rate by 5% to improve CLV by 15-20%","Reduce CAC through referral program or channel optimization","Segment customers by profitability — focus on top 20%"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Cohort analysis & segmentation","Automated alerting via email"],
  };
}


export interface Clv_cac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
