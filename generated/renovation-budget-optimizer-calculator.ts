// Auto-generated from renovation-budget-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Renovation_budget_optimizer_calculatorInput {
  total_area_sqft: number;
  scope_complexity: string;
  material_quality: string;
  labor_efficiency_factor: number;
  waste_factor_pct: number;
  contingency_pct: number;
  region_cost_index: number;
  sustainability_target: string;
  phased_renovation: boolean;
}

export const Renovation_budget_optimizer_calculatorInputSchema = z.object({
  total_area_sqft: z.number().min(100).max(100000).default(2000),
  scope_complexity: z.enum(['low', 'medium', 'high']).default('medium'),
  material_quality: z.enum(['economy', 'standard', 'premium']).default('standard'),
  labor_efficiency_factor: z.number().min(0.05).max(0.5).default(0.15),
  waste_factor_pct: z.number().min(0).max(30).default(10),
  contingency_pct: z.number().min(5).max(30).default(15),
  region_cost_index: z.number().min(0.7).max(1.5).default(1),
  sustainability_target: z.enum(['none', 'LEED', 'WELL', 'BREEAM']).default('none'),
  phased_renovation: z.boolean().default(false),
});

function evaluateAllFormulas(input: Renovation_budget_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.material_quality === 'economy' ? 25 : (input.material_quality === 'standard' ? 50 : (input.material_quality === 'premium' ? 90 : 50))); results["base_material_cost"] = Number.isFinite(v) ? v : 0; } catch { results["base_material_cost"] = 0; }
  try { const v = (input.scope_complexity === 'low' ? 1.0 : (input.scope_complexity === 'medium' ? 1.3 : (input.scope_complexity === 'high' ? 1.8 : 1.3))); results["scope_multiplier"] = Number.isFinite(v) ? v : 0; } catch { results["scope_multiplier"] = 0; }
  try { const v = (input.sustainability_target === 'none' ? 0 : (input.sustainability_target === 'LEED' ? 0.15 : (input.sustainability_target === 'WELL' ? 0.20 : (input.sustainability_target === 'BREEAM' ? 0.18 : 0)))); results["sustainability_surcharge"] = Number.isFinite(v) ? v : 0; } catch { results["sustainability_surcharge"] = 0; }
  try { const v = ((input.phased_renovation) ? (1.05) : (1.0)); results["phasing_efficiency"] = Number.isFinite(v) ? v : 0; } catch { results["phasing_efficiency"] = 0; }
  try { const v = input.total_area_sqft * (results["base_material_cost"] ?? 0) * (results["scope_multiplier"] ?? 0) * (1 + input.waste_factor_pct/100) * input.region_cost_index * (1 + (results["sustainability_surcharge"] ?? 0)) * (results["phasing_efficiency"] ?? 0); results["material_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["material_cost_total"] = 0; }
  try { const v = input.total_area_sqft * input.labor_efficiency_factor * 65 * (results["scope_multiplier"] ?? 0) * input.region_cost_index * (results["phasing_efficiency"] ?? 0); results["labor_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost_total"] = 0; }
  try { const v = ((results["material_cost_total"] ?? 0) + (results["labor_cost_total"] ?? 0)) * (input.contingency_pct/100); results["contingency_amount"] = Number.isFinite(v) ? v : 0; } catch { results["contingency_amount"] = 0; }
  try { const v = (results["material_cost_total"] ?? 0) + (results["labor_cost_total"] ?? 0) + (results["contingency_amount"] ?? 0); results["primaryResult"] = Number.isFinite(v) ? v : 0; } catch { results["primaryResult"] = 0; }
  return results;
}


export function calculateRenovation_budget_optimizer_calculator(input: Renovation_budget_optimizer_calculatorInput): Renovation_budget_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_budget"] ?? 0;
  const breakdown = {
    material_cost: values["material_cost"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    contingency: values["contingency"] ?? 0,
    cost_per_sqft: values["cost_per_sqft"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Material Waste Inefficiency","Labor Productivity Gap","Scope Creep Allowance"];
  const suggestedActions: string[] = ["Implement Lean Material Management","Enhance Crew Training & Workflow","Conduct Value Engineering Review","Optimize Phasing Schedule"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Gantt chart integration"],
  };
}


export interface Renovation_budget_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { material_cost: number; labor_cost: number; contingency: number; cost_per_sqft: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
