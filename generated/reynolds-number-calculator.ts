// Auto-generated from reynolds-number-calculator-schema.json
import * as z from 'zod';

export interface Reynolds_number_calculatorInput {
  fluid_type: string;
  density: number;
  dynamic_viscosity: number;
  velocity: number;
  pipe_diameter: number;
  pipe_roughness: number;
  temperature: number;
  flow_regime_threshold: string;
}

export const Reynolds_number_calculatorInputSchema = z.object({
  fluid_type: z.string().default(''),
  density: z.number().min(0.1).max(20000).default(998.2),
  dynamic_viscosity: z.number().min(0.000001).max(100).default(0.001002),
  velocity: z.number().min(0.001).max(100).default(1.5),
  pipe_diameter: z.number().min(0.001).max(10).default(0.05),
  pipe_roughness: z.number().min(0).max(0.1).default(0.000045),
  temperature: z.number().min(-50).max(500).default(20),
  flow_regime_threshold: z.string().default(''),
});

function evaluateAllFormulas(input: Reynolds_number_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ν = μ / ρ; results["kinematic_viscosity"] = Number.isFinite(v) ? v : 0; } catch { results["kinematic_viscosity"] = 0; }
  try { const v = (ρ * V * D) / μ; results["reynolds_number"] = Number.isFinite(v) ? v : 0; } catch { results["reynolds_number"] = 0; }
  results["relative_roughness"] = 0;
  results["friction_factor"] = 0;
  results["pressure_drop_per_meter"] = 0;
  try { const v = ((Re < Re_low) ? ('Laminar') : (((Re <= Re_high) ? ('Transitional') : ('Turbulent')))); results["flow_regime"] = Number.isFinite(v) ? v : 0; } catch { results["flow_regime"] = 0; }
  results["mass_flow_rate"] = 0;
  return results;
}


export function calculateReynolds_number_calculator(input: Reynolds_number_calculatorInput): Reynolds_number_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["reynolds_number"] ?? 0;
  const breakdown = {
    kinematic_viscosity: values["kinematic_viscosity"] ?? 0,
    relative_roughness: values["relative_roughness"] ?? 0,
    friction_factor: values["friction_factor"] ?? 0,
    pressure_drop_per_meter: values["pressure_drop_per_meter"] ?? 0,
    mass_flow_rate: values["mass_flow_rate"] ?? 0,
    flow_regime: values["flow_regime"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Friction Factor","Transitional Flow Instability","Low Velocity Sedimentation Risk","High Pressure Drop"];
  const suggestedActions: string[] = ["Increase Pipe Diameter","Reduce Pipe Roughness","Adjust Flow Rate","Increase Velocity","Use Viscosity Reducer"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Custom fluid database"],
  };
}


export interface Reynolds_number_calculatorOutput {
  totalWasteCost: number;
  breakdown: { kinematic_viscosity: number; relative_roughness: number; friction_factor: number; pressure_drop_per_meter: number; mass_flow_rate: number; flow_regime: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
