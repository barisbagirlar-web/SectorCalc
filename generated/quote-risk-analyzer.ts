// Auto-generated from quote-risk-analyzer-schema.json
import * as z from 'zod';

export interface Quote_risk_analyzerInput {
  order_volume: number;
  unit_price: number;
  production_lead_time_days: number;
  material_cost_variability: number;
  labor_skill_level: string;
  quality_defect_rate: number;
  logistics_complexity: number;
  customer_credit_rating: string;
  contract_penalty_clause: boolean;
}

export const Quote_risk_analyzerInputSchema = z.object({
  order_volume: z.number().min(1).max(1000000).default(1000),
  unit_price: z.number().min(0.01).max(100000).default(50),
  production_lead_time_days: z.number().min(1).max(365).default(30),
  material_cost_variability: z.number().min(0).max(50).default(5),
  labor_skill_level: z.enum(['low', 'medium', 'high']).default('medium'),
  quality_defect_rate: z.number().min(0).max(100).default(2),
  logistics_complexity: z.number().min(1).max(10).default(5),
  customer_credit_rating: z.enum(['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D']).default('BBB'),
  contract_penalty_clause: z.boolean().default(false),
});

function evaluateAllFormulas(input: Quote_risk_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["base_revenue"] = input.order_volume * input.unit_price; } catch { results["base_revenue"] = 0; }
  try { results["defect_risk_cost"] = (results["base_revenue"] ?? 0) * (input.quality_defect_rate / 100) * 1.5; } catch { results["defect_risk_cost"] = 0; }
  try { results["lead_time_risk_factor"] = 1 + (input.production_lead_time_days / 365) * (input.logistics_complexity / 10); } catch { results["lead_time_risk_factor"] = 0; }
  try { results["material_cost_risk"] = (results["base_revenue"] ?? 0) * 0.4 * (input.material_cost_variability / 100); } catch { results["material_cost_risk"] = 0; }
  results["credit_risk_factor"] = 0;
  results["penalty_risk"] = 0;
  try { results["risk_score"] = Math.min(100, (((results["defect_risk_cost"] ?? 0) + (results["material_cost_risk"] ?? 0) + (results["penalty_risk"] ?? 0)) / (results["base_revenue"] ?? 0) * 100 * (results["lead_time_risk_factor"] ?? 0)) + ((results["credit_risk_factor"] ?? 0) * 100)); } catch { results["risk_score"] = 0; }
  return results;
}


export function calculateQuote_risk_analyzer(input: Quote_risk_analyzerInput): Quote_risk_analyzerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["risk_score"] ?? 0;
  const breakdown = {
    cost_risk_index: values["cost_risk_index"] ?? 0,
    defect_risk_cost: values["defect_risk_cost"] ?? 0,
    material_cost_risk: values["material_cost_risk"] ?? 0,
    penalty_risk: values["penalty_risk"] ?? 0,
    credit_risk_factor: values["credit_risk_factor"] ?? 0,
    lead_time_risk_factor: values["lead_time_risk_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Hidden Rework Cost","Expediting Shipping Cost","Inventory Holding Cost"];
  const suggestedActions: string[] = ["Reduce Lead Time","Improve Quality Control","Hedge Material Costs","Enhanced Credit Check","Negotiate Penalty Waiver"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","API integration"],
  };
}


export interface Quote_risk_analyzerOutput {
  totalWasteCost: number;
  breakdown: { cost_risk_index: number; defect_risk_cost: number; material_cost_risk: number; penalty_risk: number; credit_risk_factor: number; lead_time_risk_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
