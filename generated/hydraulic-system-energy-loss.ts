// Auto-generated from hydraulic-system-energy-loss-schema.json
import * as z from 'zod';

export interface Hydraulic_system_energy_lossInput {
  flow_rate: number;
  pressure_drop_total: number;
  fluid_density: number;
  kinematic_viscosity: number;
  pipe_length: number;
  pipe_diameter: number;
  valve_count: number;
  fitting_count: number;
  system_type: string;
  is_new_system: boolean;
}

export const Hydraulic_system_energy_lossInputSchema = z.object({
  flow_rate: z.number().min(0).max(10000).default(100),
  pressure_drop_total: z.number().min(0).max(500).default(50),
  fluid_density: z.number().min(700).max(1200).default(870),
  kinematic_viscosity: z.number().min(10).max(500).default(46),
  pipe_length: z.number().min(0).max(1000).default(50),
  pipe_diameter: z.number().min(5).max(200).default(25),
  valve_count: z.number().min(0).max(50).default(5),
  fitting_count: z.number().min(0).max(200).default(20),
  system_type: z.enum(['industrial', 'mobile', 'marine', 'aerospace']).default('industrial'),
  is_new_system: z.boolean().default(false),
});

function evaluateAllFormulas(input: Hydraulic_system_energy_lossInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["flow_velocity"] = 0;
  try { const v = (v * D) / ν; results["reynolds_number"] = Number.isFinite(v) ? v : 0; } catch { results["reynolds_number"] = 0; }
  results["darcy_friction_factor"] = 0;
  results["pipe_friction_loss"] = 0;
  results["minor_losses"] = 0;
  try { const v = ΔP_pipe + ΔP_minor; results["total_pressure_loss"] = Number.isFinite(v) ? v : 0; } catch { results["total_pressure_loss"] = 0; }
  try { const v = ΔP_total * Q; results["primary_energy_loss"] = Number.isFinite(v) ? v : 0; } catch { results["primary_energy_loss"] = 0; }
  return results;
}


export function calculateHydraulic_system_energy_loss(input: Hydraulic_system_energy_lossInput): Hydraulic_system_energy_lossOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_energy_loss"] ?? 0;
  const breakdown = {
    pipe_friction_loss_watts: values["pipe_friction_loss_watts"] ?? 0,
    minor_losses_watts: values["minor_losses_watts"] ?? 0,
    flow_velocity: values["flow_velocity"] ?? 0,
    reynolds_number: values["reynolds_number"] ?? 0,
    darcy_friction_factor: values["darcy_friction_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Friction Factor","Laminar Flow Regime","Excessive Valve Loss"];
  const suggestedActions: string[] = ["Increase Pipe Diameter","Reduce Valve Count or Use Low-Loss Valves","Optimize Fluid Viscosity","Clean or Replace Pipes"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-system comparison","Custom threshold configuration"],
  };
}


export interface Hydraulic_system_energy_lossOutput {
  totalWasteCost: number;
  breakdown: { pipe_friction_loss_watts: number; minor_losses_watts: number; flow_velocity: number; reynolds_number: number; darcy_friction_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
