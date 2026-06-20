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
  dataConfidence?: number;
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
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Renovation_budget_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_area_sqft * input.region_cost_index; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.total_area_sqft * input.region_cost_index * (1 + (input.labor_efficiency_factor / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.total_area_sqft * input.region_cost_index * (1 + (input.labor_efficiency_factor / 100)) * ((input.waste_factor_pct / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.waste_factor_pct / 100); results["factor_waste_factor_pct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_waste_factor_pct"] = Number.NaN; }
  return results;
}


export function calculateRenovation_budget_optimizer_calculator(input: Renovation_budget_optimizer_calculatorInput): Renovation_budget_optimizer_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Gantt chart integration"],
  };
}


export interface Renovation_budget_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
