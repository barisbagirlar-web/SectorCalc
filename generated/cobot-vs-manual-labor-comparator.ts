// Auto-generated from cobot-vs-manual-labor-comparator-schema.json
import * as z from 'zod';

export interface Cobot_vs_manual_labor_comparatorInput {
  annual_manual_labor_cost: number;
  number_of_workers: number;
  cobot_purchase_price: number;
  cobot_annual_maintenance: number;
  cobot_lifespan_years: number;
  discount_rate: number;
  labor_productivity_factor: number;
  cobot_uptime_percent: number;
  shift_type: string;
  include_training_cost: boolean;
  training_cost: number;
}

export const Cobot_vs_manual_labor_comparatorInputSchema = z.object({
  annual_manual_labor_cost: z.number().min(20000).max(120000).default(45000),
  number_of_workers: z.number().min(1).max(20).default(2),
  cobot_purchase_price: z.number().min(15000).max(150000).default(35000),
  cobot_annual_maintenance: z.number().min(500).max(15000).default(3000),
  cobot_lifespan_years: z.number().min(3).max(15).default(8),
  discount_rate: z.number().min(2).max(20).default(8),
  labor_productivity_factor: z.number().min(0.5).max(1).default(0.85),
  cobot_uptime_percent: z.number().min(80).max(99.9).default(95),
  shift_type: z.enum(['Single', 'Double', 'Triple']).default('Single'),
  include_training_cost: z.boolean().default(true),
  training_cost: z.number().min(0).max(30000).default(5000),
});

function evaluateAllFormulas(input: Cobot_vs_manual_labor_comparatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_manual_labor_cost * input.number_of_workers * input.labor_productivity_factor; results["annual_manual_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["annual_manual_cost_total"] = 0; }
  try { const v = input.cobot_annual_maintenance + (input.cobot_annual_maintenance * 0.05); results["annual_cobot_operating_cost"] = Number.isFinite(v) ? v : 0; } catch { results["annual_cobot_operating_cost"] = 0; }
  try { const v = ((results["annual_manual_cost_total"] ?? 0) * (input.shift_type == 'Single' ? 1 : (input.shift_type == 'Double' ? 2 : 3))) - (results["annual_cobot_operating_cost"] ?? 0); results["annual_savings"] = Number.isFinite(v) ? v : 0; } catch { results["annual_savings"] = 0; }
  try { const v = input.cobot_purchase_price + (input.include_training_cost ? input.training_cost : 0); results["initial_investment"] = Number.isFinite(v) ? v : 0; } catch { results["initial_investment"] = 0; }
  try { const v = -(results["initial_investment"] ?? 0) + (((input.discount_rate/100)) === 0 ? ((results["annual_savings"] ?? 0)) * (input.cobot_lifespan_years) : ((results["annual_savings"] ?? 0)) * (Math.pow(1 + (input.discount_rate/100), (input.cobot_lifespan_years)) - 1) / (((input.discount_rate/100)) * Math.pow(1 + (input.discount_rate/100), (input.cobot_lifespan_years)))); results["net_present_value"] = Number.isFinite(v) ? v : 0; } catch { results["net_present_value"] = 0; }
  try { const v = (results["initial_investment"] ?? 0) / (results["annual_savings"] ?? 0); results["payback_years"] = Number.isFinite(v) ? v : 0; } catch { results["payback_years"] = 0; }
  try { const v = (((results["annual_savings"] ?? 0) * input.cobot_lifespan_years - (results["initial_investment"] ?? 0)) / (results["initial_investment"] ?? 0)) * 100; results["return_on_investment"] = Number.isFinite(v) ? v : 0; } catch { results["return_on_investment"] = 0; }
  return results;
}


export function calculateCobot_vs_manual_labor_comparator(input: Cobot_vs_manual_labor_comparatorInput): Cobot_vs_manual_labor_comparatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["net_present_value"] ?? 0;
  const breakdown = {
    annual_manual_cost_total: values["annual_manual_cost_total"] ?? 0,
    annual_cobot_operating_cost: values["annual_cobot_operating_cost"] ?? 0,
    annual_savings: values["annual_savings"] ?? 0,
    initial_investment: values["initial_investment"] ?? 0,
    payback_years: values["payback_years"] ?? 0,
    return_on_investment: values["return_on_investment"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Manual Labor Productivity Loss","Cobot Downtime Cost","Shift Utilization Gap"];
  const suggestedActions: string[] = ["Apply Lean before Automating","Consider Cobot Sharing","Run Six Sigma DMAIC","Ergonomic Risk Assessment"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Sensitivity analysis","Custom reporting"],
  };
}


export interface Cobot_vs_manual_labor_comparatorOutput {
  totalWasteCost: number;
  breakdown: { annual_manual_cost_total: number; annual_cobot_operating_cost: number; annual_savings: number; initial_investment: number; payback_years: number; return_on_investment: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
