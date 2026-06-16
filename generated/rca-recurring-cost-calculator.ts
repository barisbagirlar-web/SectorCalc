// Auto-generated from rca-recurring-cost-calculator-schema.json
import * as z from 'zod';

export interface Rca_recurring_cost_calculatorInput {
  labor_rate: number;
  labor_hours_per_cycle: number;
  material_cost_per_unit: number;
  energy_cost_per_cycle: number;
  maintenance_cost_per_cycle: number;
  overhead_rate: number;
  cycle_time_minutes: number;
  defect_rate: number;
  rework_cost_per_defect: number;
  production_volume: number;
  shift_pattern: string;
  include_environmental_cost: boolean;
}

export const Rca_recurring_cost_calculatorInputSchema = z.object({
  labor_rate: z.number().min(7.25).max(150).default(25),
  labor_hours_per_cycle: z.number().min(0.01).max(8).default(0.5),
  material_cost_per_unit: z.number().min(0).max(10000).default(12),
  energy_cost_per_cycle: z.number().min(0).max(500).default(1.5),
  maintenance_cost_per_cycle: z.number().min(0).max(200).default(0.75),
  overhead_rate: z.number().min(0).max(100).default(20),
  cycle_time_minutes: z.number().min(0.1).max(480).default(30),
  defect_rate: z.number().min(0).max(100).default(2),
  rework_cost_per_defect: z.number().min(0).max(1000).default(5),
  production_volume: z.number().min(1).max(1000000).default(10000),
  shift_pattern: z.enum(['single', 'double', 'continuous']).default('single'),
  include_environmental_cost: z.boolean().default(false),
});

function evaluateAllFormulas(input: Rca_recurring_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.labor_rate * input.labor_hours_per_cycle; results["direct_labor_cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost_per_unit"] = 0; }
  try { const v = (input.defect_rate / 100) * input.rework_cost_per_defect; results["quality_cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["quality_cost_per_unit"] = 0; }
  try { const v = input.include_environmental_cost ? (0.05 * (input.material_cost_per_unit + input.energy_cost_per_cycle)) : 0; results["environmental_cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["environmental_cost_per_unit"] = 0; }
  try { const v = (input.shift_pattern === 'single' ? 1.0 : (input.shift_pattern === 'double' ? 1.5 : (input.shift_pattern === 'continuous' ? 2.0 : 1.0))); results["shift_multiplier"] = Number.isFinite(v) ? v : 0; } catch { results["shift_multiplier"] = 0; }
  try { const v = (results["direct_labor_cost_per_unit"] ?? 0) + input.material_cost_per_unit + input.energy_cost_per_cycle + input.maintenance_cost_per_cycle + (results["quality_cost_per_unit"] ?? 0) + (results["environmental_cost_per_unit"] ?? 0); results["total_direct_cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["total_direct_cost_per_unit"] = 0; }
  try { const v = (input.overhead_rate / 100) * (results["total_direct_cost_per_unit"] ?? 0) * (results["shift_multiplier"] ?? 0); results["overhead_cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["overhead_cost_per_unit"] = 0; }
  try { const v = (results["total_direct_cost_per_unit"] ?? 0) + (results["overhead_cost_per_unit"] ?? 0); results["total_recurring_cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["total_recurring_cost_per_unit"] = 0; }
  return results;
}


export function calculateRca_recurring_cost_calculator(input: Rca_recurring_cost_calculatorInput): Rca_recurring_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_recurring_cost_per_unit"] ?? 0;
  const breakdown = {
    direct_labor_cost_per_unit: values["direct_labor_cost_per_unit"] ?? 0,
    material_cost_per_unit: values["material_cost_per_unit"] ?? 0,
    energy_cost_per_cycle: values["energy_cost_per_cycle"] ?? 0,
    maintenance_cost_per_cycle: values["maintenance_cost_per_cycle"] ?? 0,
    quality_cost_per_unit: values["quality_cost_per_unit"] ?? 0,
    environmental_cost_per_unit: values["environmental_cost_per_unit"] ?? 0,
    overhead_cost_per_unit: values["overhead_cost_per_unit"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Defect & Rework Loss","Energy Inefficiency Loss","Overhead Allocation Distortion"];
  const suggestedActions: string[] = ["Implement Six Sigma DMAIC to reduce defect rate below 2%.","Conduct energy audit (ISO 50001) to identify savings opportunities.","Apply Lean Kaizen to reduce cycle time and labor hours.","Review overhead allocation using Activity-Based Costing (ABC)."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated report generation"],
  };
}


export interface Rca_recurring_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { direct_labor_cost_per_unit: number; material_cost_per_unit: number; energy_cost_per_cycle: number; maintenance_cost_per_cycle: number; quality_cost_per_unit: number; environmental_cost_per_unit: number; overhead_cost_per_unit: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
