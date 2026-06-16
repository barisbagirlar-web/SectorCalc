// Auto-generated from pipe-flow-calculator-schema.json
import * as z from 'zod';

export interface Pipe_flow_calculatorInput {
  pipe_diameter: number;
  pipe_length: number;
  flow_rate: number;
  fluid_density: number;
  fluid_viscosity: number;
  roughness: number;
  elevation_change: number;
  minor_loss_coefficient: number;
  flow_regime: string;
  include_measurement_uncertainty: boolean;
}

export const Pipe_flow_calculatorInputSchema = z.object({
  pipe_diameter: z.number().min(0.01).max(2).default(0.1),
  pipe_length: z.number().min(1).max(10000).default(100),
  flow_rate: z.number().min(0.0001).max(10).default(0.01),
  fluid_density: z.number().min(600).max(2000).default(1000),
  fluid_viscosity: z.number().min(0.0001).max(10).default(0.001),
  roughness: z.number().min(0.000001).max(0.01).default(0.000045),
  elevation_change: z.number().min(-100).max(100).default(0),
  minor_loss_coefficient: z.number().min(0).max(100).default(0.5),
  flow_regime: z.enum(['auto', 'laminar', 'turbulent']).default('auto'),
  include_measurement_uncertainty: z.boolean().default(true),
});

function evaluateAllFormulas(input: Pipe_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 3.141592653589793 * (input.pipe_diameter / 2)**2; results["cross_sectional_area"] = Number.isFinite(v) ? v : 0; } catch { results["cross_sectional_area"] = 0; }
  try { const v = input.flow_rate / (results["cross_sectional_area"] ?? 0); results["flow_velocity"] = Number.isFinite(v) ? v : 0; } catch { results["flow_velocity"] = 0; }
  try { const v = input.fluid_density * (results["flow_velocity"] ?? 0) * input.pipe_diameter / input.fluid_viscosity; results["reynolds_number"] = Number.isFinite(v) ? v : 0; } catch { results["reynolds_number"] = 0; }
  results["friction_factor"] = 0;
  try { const v = (results["friction_factor"] ?? 0) * (input.pipe_length / input.pipe_diameter) * ((results["flow_velocity"] ?? 0)**2 / (2 * 9.80665)); results["major_loss"] = Number.isFinite(v) ? v : 0; } catch { results["major_loss"] = 0; }
  try { const v = input.minor_loss_coefficient * ((results["flow_velocity"] ?? 0)**2 / (2 * 9.80665)); results["minor_loss"] = Number.isFinite(v) ? v : 0; } catch { results["minor_loss"] = 0; }
  try { const v = (results["major_loss"] ?? 0) + (results["minor_loss"] ?? 0) + input.elevation_change; results["total_head_loss"] = Number.isFinite(v) ? v : 0; } catch { results["total_head_loss"] = 0; }
  try { const v = input.fluid_density * 9.80665 * (results["total_head_loss"] ?? 0); results["pressure_drop"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_drop"] = 0; }
  return results;
}


export function calculatePipe_flow_calculator(input: Pipe_flow_calculatorInput): Pipe_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pressure_drop"] ?? 0;
  const breakdown = {
    cross_sectional_area: values["cross_sectional_area"] ?? 0,
    flow_velocity: values["flow_velocity"] ?? 0,
    reynolds_number: values["reynolds_number"] ?? 0,
    friction_factor: values["friction_factor"] ?? 0,
    major_loss: values["major_loss"] ?? 0,
    minor_loss: values["minor_loss"] ?? 0,
    total_head_loss: values["total_head_loss"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Velocity Squared Contribution","Relative Roughness","Viscous Damping Ratio"];
  const suggestedActions: string[] = ["Increase pipe diameter to reduce velocity and friction losses.","Consider smoother pipe material (e.g., HDPE instead of steel) or internal lining.","Reduce number of fittings or use long-radius bends to lower minor loss coefficient.","Verify fluid viscosity; consider heating to reduce viscosity and achieve turbulent flow."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Customizable unit system","Multi-scenario comparison"],
  };
}


export interface Pipe_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: { cross_sectional_area: number; flow_velocity: number; reynolds_number: number; friction_factor: number; major_loss: number; minor_loss: number; total_head_loss: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
