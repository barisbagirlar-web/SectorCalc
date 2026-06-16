// Auto-generated from material-replacement-cost-comparator-calculator-schema.json
import * as z from 'zod';

export interface Material_replacement_cost_comparator_calculatorInput {
  current_material_cost: number;
  alternative_material_cost: number;
  annual_volume: number;
  scrap_rate_current: number;
  scrap_rate_alternative: number;
  logistics_cost_current: number;
  logistics_cost_alternative: number;
  changeover_cost: number;
  quality_impact: string;
  supplier_reliability: string;
  currency_risk: number;
  inventory_holding_cost: number;
  lead_time_current: number;
  lead_time_alternative: number;
}

export const Material_replacement_cost_comparator_calculatorInputSchema = z.object({
  current_material_cost: z.number().min(0).max(100000).default(100),
  alternative_material_cost: z.number().min(0).max(100000).default(85),
  annual_volume: z.number().min(1).max(100000000).default(10000),
  scrap_rate_current: z.number().min(0).max(100).default(5),
  scrap_rate_alternative: z.number().min(0).max(100).default(3),
  logistics_cost_current: z.number().min(0).max(10000).default(10),
  logistics_cost_alternative: z.number().min(0).max(10000).default(12),
  changeover_cost: z.number().min(0).max(10000000).default(5000),
  quality_impact: z.enum(['none', 'low', 'medium', 'high']).default('none'),
  supplier_reliability: z.enum(['excellent', 'good', 'fair', 'poor']).default('good'),
  currency_risk: z.number().min(0).max(20).default(0),
  inventory_holding_cost: z.number().min(0).max(100).default(20),
  lead_time_current: z.number().min(0).max(365).default(14),
  lead_time_alternative: z.number().min(0).max(365).default(21),
});

function evaluateAllFormulas(input: Material_replacement_cost_comparator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.current_material_cost * input.annual_volume; results["annual_material_cost_current"] = Number.isFinite(v) ? v : 0; } catch { results["annual_material_cost_current"] = 0; }
  try { const v = input.alternative_material_cost * input.annual_volume; results["annual_material_cost_alternative"] = Number.isFinite(v) ? v : 0; } catch { results["annual_material_cost_alternative"] = 0; }
  try { const v = (results["annual_material_cost_current"] ?? 0) * (input.scrap_rate_current / 100); results["scrap_cost_current"] = Number.isFinite(v) ? v : 0; } catch { results["scrap_cost_current"] = 0; }
  try { const v = (results["annual_material_cost_alternative"] ?? 0) * (input.scrap_rate_alternative / 100); results["scrap_cost_alternative"] = Number.isFinite(v) ? v : 0; } catch { results["scrap_cost_alternative"] = 0; }
  try { const v = input.logistics_cost_current * input.annual_volume; results["logistics_cost_current_annual"] = Number.isFinite(v) ? v : 0; } catch { results["logistics_cost_current_annual"] = 0; }
  try { const v = input.logistics_cost_alternative * input.annual_volume; results["logistics_cost_alternative_annual"] = Number.isFinite(v) ? v : 0; } catch { results["logistics_cost_alternative_annual"] = 0; }
  try { const v = (input.current_material_cost * input.annual_volume * (input.lead_time_current / 365)) * (input.inventory_holding_cost / 100); results["inventory_cost_current"] = Number.isFinite(v) ? v : 0; } catch { results["inventory_cost_current"] = 0; }
  try { const v = (input.alternative_material_cost * input.annual_volume * (input.lead_time_alternative / 365)) * (input.inventory_holding_cost / 100); results["inventory_cost_alternative"] = Number.isFinite(v) ? v : 0; } catch { results["inventory_cost_alternative"] = 0; }
  try { const v = (input.quality_impact === 'none' ? 0 : (input.quality_impact === 'low' ? (results["annual_material_cost_alternative"] ?? 0) * 0.005 : (input.quality_impact === 'medium' ? (results["annual_material_cost_alternative"] ?? 0) * 0.015 : (input.quality_impact === 'high' ? (results["annual_material_cost_alternative"] ?? 0) * 0.03 : 0)))); results["quality_impact_cost"] = Number.isFinite(v) ? v : 0; } catch { results["quality_impact_cost"] = 0; }
  try { const v = (results["annual_material_cost_alternative"] ?? 0) * (input.currency_risk / 100); results["currency_risk_cost"] = Number.isFinite(v) ? v : 0; } catch { results["currency_risk_cost"] = 0; }
  try { const v = (results["annual_material_cost_current"] ?? 0) + (results["scrap_cost_current"] ?? 0) + (results["logistics_cost_current_annual"] ?? 0) + (results["inventory_cost_current"] ?? 0); results["total_cost_current"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost_current"] = 0; }
  try { const v = (results["annual_material_cost_alternative"] ?? 0) + (results["scrap_cost_alternative"] ?? 0) + (results["logistics_cost_alternative_annual"] ?? 0) + (results["inventory_cost_alternative"] ?? 0) + (results["quality_impact_cost"] ?? 0) + (results["currency_risk_cost"] ?? 0) + (input.changeover_cost / 1); results["total_cost_alternative"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost_alternative"] = 0; }
  try { const v = (results["total_cost_current"] ?? 0) - (results["total_cost_alternative"] ?? 0); results["total_annual_savings"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_savings"] = 0; }
  return results;
}


export function calculateMaterial_replacement_cost_comparator_calculator(input: Material_replacement_cost_comparator_calculatorInput): Material_replacement_cost_comparator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_savings"] ?? 0;
  const breakdown = {
    material_cost_savings: values["material_cost_savings"] ?? 0,
    scrap_cost_savings: values["scrap_cost_savings"] ?? 0,
    logistics_cost_savings: values["logistics_cost_savings"] ?? 0,
    inventory_cost_savings: values["inventory_cost_savings"] ?? 0,
    quality_impact_cost: values["quality_impact_cost"] ?? 0,
    currency_risk_cost: values["currency_risk_cost"] ?? 0,
    changeover_cost: values["changeover_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Hidden Quality Downtime","Hidden Obsolescence Risk","Hidden Training Cost"];
  const suggestedActions: string[] = ["Negotiate volume discount","Optimize logistics for alternative","Run a pilot quality trial","Supplier development program","Implement currency hedging"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Supplier benchmarking"],
  };
}


export interface Material_replacement_cost_comparator_calculatorOutput {
  totalWasteCost: number;
  breakdown: { material_cost_savings: number; scrap_cost_savings: number; logistics_cost_savings: number; inventory_cost_savings: number; quality_impact_cost: number; currency_risk_cost: number; changeover_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
