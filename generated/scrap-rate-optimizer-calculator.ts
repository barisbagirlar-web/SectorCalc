// Auto-generated from scrap-rate-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Scrap_rate_optimizer_calculatorInput {
  total_units_produced: number;
  defective_units: number;
  rework_units: number;
  material_cost_per_unit: number;
  labor_cost_per_unit: number;
  overhead_cost_per_unit: number;
  process_stage: string;
  defect_type: string;
  dataConfidence?: number;
}

export const Scrap_rate_optimizer_calculatorInputSchema = z.object({
  total_units_produced: z.number().min(1).max(10000000).default(10000),
  defective_units: z.number().min(0).max(10000000).default(500),
  rework_units: z.number().min(0).max(10000000).default(200),
  material_cost_per_unit: z.number().min(0.01).max(10000).default(5.5),
  labor_cost_per_unit: z.number().min(0.01).max(10000).default(2.75),
  overhead_cost_per_unit: z.number().min(0.01).max(10000).default(1.25),
  process_stage: z.enum(['raw_material', 'machining', 'assembly', 'final_assembly', 'packaging']).default('final_assembly'),
  defect_type: z.enum(['dimensional', 'surface', 'material', 'assembly', 'functional', 'cosmetic']).default('dimensional'),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Scrap_rate_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_units_produced * input.material_cost_per_unit; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.total_units_produced * input.material_cost_per_unit; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.total_units_produced * input.material_cost_per_unit * 1 * (input.defective_units * input.rework_units); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.defective_units; results["factor_defective_units"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_defective_units"] = 0; }
  try { const v = input.rework_units; results["factor_rework_units"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_rework_units"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateScrap_rate_optimizer_calculator(input: Scrap_rate_optimizer_calculatorInput): Scrap_rate_optimizer_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-plant comparison","Automated alerting"],
  };
}


export interface Scrap_rate_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
