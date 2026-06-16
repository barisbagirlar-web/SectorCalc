// Auto-generated from weld-volume-cost-calculator-schema.json
import * as z from 'zod';

export interface Weld_volume_cost_calculatorInput {
  joint_type: string;
  plate_thickness: number;
  root_face: number;
  root_gap: number;
  groove_angle: number;
  weld_length: number;
  leg_length: number;
  weld_process: string;
  material_density: number;
  labor_rate: number;
  overhead_rate: number;
  consumable_cost_per_kg: number;
  deposition_efficiency: number;
  operator_factor: number;
  weld_speed: number;
  wire_feed_speed: number;
  wire_diameter: number;
  use_premium_data: boolean;
}

export const Weld_volume_cost_calculatorInputSchema = z.object({
  joint_type: z.enum(['butt', 'single_v', 'double_v', 'fillet', 'single_bevel', 'double_bevel']).default('butt'),
  plate_thickness: z.number().min(1).max(200).default(10),
  root_face: z.number().min(0).max(10).default(2),
  root_gap: z.number().min(0).max(10).default(3),
  groove_angle: z.number().min(20).max(90).default(60),
  weld_length: z.number().min(10).max(100000).default(1000),
  leg_length: z.number().min(2).max(50).default(6),
  weld_process: z.enum(['SMAW', 'GMAW', 'FCAW', 'SAW', 'GTAW']).default('SMAW'),
  material_density: z.number().min(2.7).max(19.3).default(7.85),
  labor_rate: z.number().min(10).max(200).default(45),
  overhead_rate: z.number().min(0).max(100).default(30),
  consumable_cost_per_kg: z.number().min(1).max(50).default(5.5),
  deposition_efficiency: z.number().min(30).max(99).default(65),
  operator_factor: z.number().min(10).max(80).default(40),
  weld_speed: z.number().min(50).max(2000).default(300),
  wire_feed_speed: z.number().min(1).max(30).default(8),
  wire_diameter: z.number().min(0.8).max(4).default(1.2),
  use_premium_data: z.boolean().default(false),
});

function evaluateAllFormulas(input: Weld_volume_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.joint_type == 'butt') ? (0) : (((input.joint_type == 'single_v') ? (0) : (((input.joint_type == 'double_v') ? (0) : (((input.joint_type == 'fillet') ? (0) : (((input.joint_type == 'single_bevel') ? (0) : (((input.joint_type == 'double_bevel') ? (0) : (0)))))))))))); results["cross_sectional_area"] = Number.isFinite(v) ? v : 0; } catch { results["cross_sectional_area"] = 0; }
  try { const v = (results["cross_sectional_area"] ?? 0) * input.weld_length; results["weld_volume"] = Number.isFinite(v) ? v : 0; } catch { results["weld_volume"] = 0; }
  try { const v = (results["weld_volume"] ?? 0) * input.material_density / 1000; results["weld_mass"] = Number.isFinite(v) ? v : 0; } catch { results["weld_mass"] = 0; }
  try { const v = (results["weld_mass"] ?? 0) / (input.deposition_efficiency / 100); results["consumable_mass"] = Number.isFinite(v) ? v : 0; } catch { results["consumable_mass"] = 0; }
  try { const v = input.weld_length / input.weld_speed; results["arc_time"] = Number.isFinite(v) ? v : 0; } catch { results["arc_time"] = 0; }
  try { const v = (results["arc_time"] ?? 0) / (input.operator_factor / 100); results["total_labor_time"] = Number.isFinite(v) ? v : 0; } catch { results["total_labor_time"] = 0; }
  try { const v = ((results["total_labor_time"] ?? 0) / 60) * input.labor_rate * (1 + input.overhead_rate/100) + ((results["consumable_mass"] ?? 0) / 1000) * input.consumable_cost_per_kg; results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  return results;
}


export function calculateWeld_volume_cost_calculator(input: Weld_volume_cost_calculatorInput): Weld_volume_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost"] ?? 0;
  const breakdown = {
    labor_cost: values["labor_cost"] ?? 0,
    consumable_cost: values["consumable_cost"] ?? 0,
    weld_volume: values["weld_volume"] ?? 0,
    weld_mass: values["weld_mass"] ?? 0,
    arc_time: values["arc_time"] ?? 0,
    total_labor_time: values["total_labor_time"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Weld Metal","Deposition Inefficiency Loss","Non-Arc Time Loss"];
  const suggestedActions: string[] = ["Reduce groove angle or root gap to minimize weld volume. Consider double-V joint for thicker plates.","Switch to a process with higher deposition efficiency (e.g., GMAW or SAW) to reduce consumable waste.","Implement Lean techniques: reduce setup time, use quick-change fixtures, and improve work cell layout.","Perform a cost-benefit analysis for robotic welding or automation to reduce labor cost.","Review weld procedure specifications (WPS) to ensure parameters are optimized per AWS D1.1."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-user collaboration","Custom joint library","API access"],
  };
}


export interface Weld_volume_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { labor_cost: number; consumable_cost: number; weld_volume: number; weld_mass: number; arc_time: number; total_labor_time: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
