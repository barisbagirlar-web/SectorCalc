// Auto-generated from beam-deflection-calculator-schema.json
import * as z from 'zod';

export interface Beam_deflection_calculatorInput {
  beam_length: number;
  load_type: string;
  point_load: number;
  udl_load: number;
  load_position: number;
  young_modulus: number;
  moment_of_inertia: number;
  yield_strength: number;
  safety_factor_target: number;
  support_condition: string;
  use_lean_optimization: boolean;
}

export const Beam_deflection_calculatorInputSchema = z.object({
  beam_length: z.number().min(0.1).max(50).default(3),
  load_type: z.enum(['point_center', 'point_any', 'uniform', 'triangular']).default('point_center'),
  point_load: z.number().min(0).max(500).default(10),
  udl_load: z.number().min(0).max(100).default(5),
  load_position: z.number().min(0).max(50).default(1.5),
  young_modulus: z.number().min(10).max(400).default(200),
  moment_of_inertia: z.number().min(1).max(100000).default(500),
  yield_strength: z.number().min(50).max(1000).default(250),
  safety_factor_target: z.number().min(1).max(5).default(1.5),
  support_condition: z.enum(['simply_supported', 'fixed_fixed', 'cantilever']).default('simply_supported'),
  use_lean_optimization: z.boolean().default(false),
});

function evaluateAllFormulas(input: Beam_deflection_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.load_type == 'point_center') ? (P/2) : (((input.load_type == 'point_any') ? (P*(L-a)/L) : (((input.load_type == 'uniform') ? (w*L/2) : (((input.load_type == 'triangular') ? (w*L/6) : (0)))))))); results["reaction_left"] = Number.isFinite(v) ? v : 0; } catch { results["reaction_left"] = 0; }
  try { const v = ((input.load_type == 'point_center') ? (P/2) : (((input.load_type == 'point_any') ? (P*a/L) : (((input.load_type == 'uniform') ? (w*L/2) : (((input.load_type == 'triangular') ? (w*L/3) : (0)))))))); results["reaction_right"] = Number.isFinite(v) ? v : 0; } catch { results["reaction_right"] = 0; }
  try { const v = ((input.load_type == 'point_center') ? (P*L/4) : (((input.load_type == 'point_any') ? (P*a*(L-a)/L) : (((input.load_type == 'uniform') ? (w*L**2/8) : (((input.load_type == 'triangular') ? (w*L**2/9*Math.sqrt(3)) : (0)))))))); results["max_bending_moment"] = Number.isFinite(v) ? v : 0; } catch { results["max_bending_moment"] = 0; }
  try { const v = ((input.load_type == 'point_center') ? (0) : (((input.load_type == 'point_any') ? (0) : (((input.load_type == 'uniform') ? (0) : (((input.load_type == 'triangular') ? (0) : (0)))))))); results["max_deflection"] = Number.isFinite(v) ? v : 0; } catch { results["max_deflection"] = 0; }
  results["max_bending_stress"] = 0;
  try { const v = sigma_y / sigma_max; results["actual_safety_factor"] = Number.isFinite(v) ? v : 0; } catch { results["actual_safety_factor"] = 0; }
  try { const v = sigma_max / sigma_y; results["material_utilization"] = Number.isFinite(v) ? v : 0; } catch { results["material_utilization"] = 0; }
  results["lean_mass_reduction_percent"] = 0;
  return results;
}


export function calculateBeam_deflection_calculator(input: Beam_deflection_calculatorInput): Beam_deflection_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["max_deflection"] ?? 0;
  const breakdown = {
    reaction_left: values["reaction_left"] ?? 0,
    reaction_right: values["reaction_right"] ?? 0,
    max_bending_moment: values["max_bending_moment"] ?? 0,
    max_bending_stress: values["max_bending_stress"] ?? 0,
    actual_safety_factor: values["actual_safety_factor"] ?? 0,
    material_utilization: values["material_utilization"] ?? 0,
    lean_mass_reduction_percent: values["lean_mass_reduction_percent"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Material Cost","Deflection-Induced Downtime","Safety Risk Premium"];
  const suggestedActions: string[] = ["Increase Beam Cross-Section","Reduce Span Length","Use Higher Grade Material","Apply Lean Redesign","Implement Predictive Maintenance"];
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-beam comparison","Custom material database"],
  };
}


export interface Beam_deflection_calculatorOutput {
  totalWasteCost: number;
  breakdown: { reaction_left: number; reaction_right: number; max_bending_moment: number; max_bending_stress: number; actual_safety_factor: number; material_utilization: number; lean_mass_reduction_percent: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
