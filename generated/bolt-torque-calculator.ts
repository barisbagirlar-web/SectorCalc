// Auto-generated from bolt-torque-calculator-schema.json
import * as z from 'zod';

export interface Bolt_torque_calculatorInput {
  bolt_grade: string;
  nominal_diameter: number;
  thread_pitch: number;
  friction_coefficient_thread: number;
  friction_coefficient_head: number;
  preload_percentage: number;
  lubrication_condition: string;
  joint_type: string;
  temperature: number;
  use_washers: boolean;
}

export const Bolt_torque_calculatorInputSchema = z.object({
  bolt_grade: z.enum(['4.6', '5.8', '8.8', '10.9', '12.9']).default('8.8'),
  nominal_diameter: z.number().min(3).max(100).default(12),
  thread_pitch: z.number().min(0.5).max(6).default(1.75),
  friction_coefficient_thread: z.number().min(0.04).max(0.3).default(0.12),
  friction_coefficient_head: z.number().min(0.04).max(0.35).default(0.14),
  preload_percentage: z.number().min(30).max(90).default(75),
  lubrication_condition: z.enum(['dry', 'light_oil', 'moly_paste', 'zinc_plated']).default('light_oil'),
  joint_type: z.enum(['steel_steel', 'aluminum_steel', 'composite_steel', 'cast_iron_steel']).default('steel_steel'),
  temperature: z.number().min(-40).max(300).default(20),
  use_washers: z.boolean().default(true),
});

function evaluateAllFormulas(input: Bolt_torque_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (π/4) * (d - 0.9382 * P)**2; results["tensile_stress_area"] = Number.isFinite(v) ? v : 0; } catch { results["tensile_stress_area"] = 0; }
  try { const v = sigma_y = lookup_yield(input.bolt_grade); results["yield_strength"] = Number.isFinite(v) ? v : 0; } catch { results["yield_strength"] = 0; }
  try { const v = (input.preload_percentage / 100) * sigma_y * A_s; results["target_preload"] = Number.isFinite(v) ? v : 0; } catch { results["target_preload"] = 0; }
  results["torque_coefficient"] = 0;
  try { const v = K * F_p * d / 1000; results["calculated_torque"] = Number.isFinite(v) ? v : 0; } catch { results["calculated_torque"] = 0; }
  try { const v = eta = (F_p * P) / (2 * π * T * 1000); results["preload_efficiency"] = Number.isFinite(v) ? v : 0; } catch { results["preload_efficiency"] = 0; }
  try { const v = F_p * (1 - embedment_loss_factor); results["clamp_load"] = Number.isFinite(v) ? v : 0; } catch { results["clamp_load"] = 0; }
  return results;
}


export function calculateBolt_torque_calculator(input: Bolt_torque_calculatorInput): Bolt_torque_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calculated_torque"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Friction Coefficient Scatter","Embedment & Relaxation","Temperature Derating","Tool Accuracy"];
  const suggestedActions: string[] = ["Use calibrated torque wrench with accuracy ±3% or better.","Apply molybdenum disulfide paste to threads and underhead to reduce friction scatter.","Perform torque-tension verification test on 5% of bolts per batch.","For critical joints, consider hydraulic tensioning instead of torque control.","Re-torque after 24 hours to compensate for embedment loss."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-bolt pattern optimization","Friction coefficient sensitivity analysis","API integration for CMMS"],
  };
}


export interface Bolt_torque_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
