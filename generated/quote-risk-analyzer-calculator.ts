// Auto-generated from quote-risk-analyzer-calculator-schema.json
import * as z from 'zod';

export interface Quote_risk_analyzer_calculatorInput {
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

export const Quote_risk_analyzer_calculatorInputSchema = z.object({
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

function evaluateAllFormulas(input: Quote_risk_analyzer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.order_volume * input.unit_price; results["base_revenue"] = Number.isFinite(v) ? v : 0; } catch { results["base_revenue"] = 0; }
  try { const v = (results["base_revenue"] ?? 0) * (input.quality_defect_rate / 100) * 1.5; results["defect_risk_cost"] = Number.isFinite(v) ? v : 0; } catch { results["defect_risk_cost"] = 0; }
  try { const v = 1 + (input.production_lead_time_days / 365) * (input.logistics_complexity / 10); results["lead_time_risk_factor"] = Number.isFinite(v) ? v : 0; } catch { results["lead_time_risk_factor"] = 0; }
  try { const v = (results["base_revenue"] ?? 0) * 0.4 * (input.material_cost_variability / 100); results["material_cost_risk"] = Number.isFinite(v) ? v : 0; } catch { results["material_cost_risk"] = 0; }
  try { const v = (input.customer_credit_rating === 'AAA' ? 0.01 : (input.customer_credit_rating === 'AA' ? 0.02 : (input.customer_credit_rating === 'A' ? 0.03 : (input.customer_credit_rating === 'BBB' ? 0.05 : (input.customer_credit_rating === 'BB' ? 0.10 : (input.customer_credit_rating === 'B' ? 0.15 : (input.customer_credit_rating === 'CCC' ? 0.25 : (input.customer_credit_rating === 'D' ? 0.50 : 0.05)))))))); results["credit_risk_factor"] = Number.isFinite(v) ? v : 0; } catch { results["credit_risk_factor"] = 0; }
  try { const v = ((input.contract_penalty_clause) ? ((results["base_revenue"] ?? 0) * 0.05) : (0)); results["penalty_risk"] = Number.isFinite(v) ? v : 0; } catch { results["penalty_risk"] = 0; }
  try { const v = Math.min(100, (((results["defect_risk_cost"] ?? 0) + (results["material_cost_risk"] ?? 0) + (results["penalty_risk"] ?? 0)) / (results["base_revenue"] ?? 0) * 100 * (results["lead_time_risk_factor"] ?? 0)) + ((results["credit_risk_factor"] ?? 0) * 100)); results["risk_score"] = Number.isFinite(v) ? v : 0; } catch { results["risk_score"] = 0; }
  return results;
}


export function calculateQuote_risk_analyzer_calculator(input: Quote_risk_analyzer_calculatorInput): Quote_risk_analyzer_calculatorOutput {
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


export interface Quote_risk_analyzer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { cost_risk_index: number; defect_risk_cost: number; material_cost_risk: number; penalty_risk: number; credit_risk_factor: number; lead_time_risk_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
