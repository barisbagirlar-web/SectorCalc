// Auto-generated from shift-cost-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Shift_cost_efficiency_calculatorInput {
  shift_duration_hours: number;
  total_units_produced: number;
  defective_units: number;
  rework_units: number;
  labor_cost_per_hour: number;
  number_of_operators: number;
  material_cost_per_unit: number;
  energy_cost_per_shift: number;
  planned_downtime_minutes: number;
  unplanned_downtime_minutes: number;
  shift_type: string;
  overtime_applied: boolean;
}

export const Shift_cost_efficiency_calculatorInputSchema = z.object({
  shift_duration_hours: z.number().min(1).max(24).default(8),
  total_units_produced: z.number().min(0).max(100000).default(1000),
  defective_units: z.number().min(0).max(100000).default(50),
  rework_units: z.number().min(0).max(100000).default(30),
  labor_cost_per_hour: z.number().min(0).max(200).default(25),
  number_of_operators: z.number().min(1).max(100).default(10),
  material_cost_per_unit: z.number().min(0).max(1000).default(2.5),
  energy_cost_per_shift: z.number().min(0).max(100000).default(500),
  planned_downtime_minutes: z.number().min(0).max(480).default(30),
  unplanned_downtime_minutes: z.number().min(0).max(480).default(20),
  shift_type: z.enum(['day', 'night', 'weekend']).default('day'),
  overtime_applied: z.boolean().default(false),
});

function evaluateAllFormulas(input: Shift_cost_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["total_labor_cost"] = input.labor_cost_per_hour * input.number_of_operators * input.shift_duration_hours * (1 + (input.overtime_applied ? 0.5 : 0)); } catch { results["total_labor_cost"] = 0; }
  try { results["total_material_cost"] = input.material_cost_per_unit * input.total_units_produced; } catch { results["total_material_cost"] = 0; }
  try { results["total_energy_cost"] = input.energy_cost_per_shift * (input.shift_type == 'night' ? 1.15 : (input.shift_type == 'weekend' ? 1.25 : 1.0)); } catch { results["total_energy_cost"] = 0; }
  try { results["total_downtime_cost"] = (input.planned_downtime_minutes + input.unplanned_downtime_minutes) / 60 * input.labor_cost_per_hour * input.number_of_operators * 0.8; } catch { results["total_downtime_cost"] = 0; }
  try { results["quality_cost"] = (input.defective_units + input.rework_units) * input.material_cost_per_unit * 1.2; } catch { results["quality_cost"] = 0; }
  try { results["total_shift_cost"] = (results["total_labor_cost"] ?? 0) + (results["total_material_cost"] ?? 0) + (results["total_energy_cost"] ?? 0) + (results["total_downtime_cost"] ?? 0) + (results["quality_cost"] ?? 0); } catch { results["total_shift_cost"] = 0; }
  try { results["shift_cost_efficiency"] = (input.total_units_produced - input.defective_units) * input.material_cost_per_unit / (results["total_shift_cost"] ?? 0); } catch { results["shift_cost_efficiency"] = 0; }
  return results;
}


export function calculateShift_cost_efficiency_calculator(input: Shift_cost_efficiency_calculatorInput): Shift_cost_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["shift_cost_efficiency"] ?? 0;
  const breakdown = {
    total_labor_cost: values["total_labor_cost"] ?? 0,
    total_material_cost: values["total_material_cost"] ?? 0,
    total_energy_cost: values["total_energy_cost"] ?? 0,
    total_downtime_cost: values["total_downtime_cost"] ?? 0,
    quality_cost: values["quality_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Material Waste","Unplanned Downtime Impact","Labor Efficiency Gap"];
  const suggestedActions: string[] = ["Implement SPC and root cause analysis to reduce defect rate below 5%.","Apply SMED methodology to reduce planned downtime by 20%.","Conduct energy audit to identify peak usage and shift loads to off-peak.","Cross-train operators to reduce labor idle time during unplanned downtime."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-shift comparison","Real-time OEE integration"],
  };
}


export interface Shift_cost_efficiency_calculatorOutput {
  totalWasteCost: number;
  breakdown: { total_labor_cost: number; total_material_cost: number; total_energy_cost: number; total_downtime_cost: number; quality_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
