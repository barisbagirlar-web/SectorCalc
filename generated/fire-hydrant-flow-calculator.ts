// Auto-generated from fire-hydrant-flow-calculator-schema.json
import * as z from 'zod';

export interface Fire_hydrant_flow_calculatorInput {
  static_pressure: number;
  residual_pressure: number;
  flow_rate_test: number;
  pipe_diameter: number;
  pipe_length: number;
  hazen_williams_coefficient: number;
  elevation_difference: number;
  number_of_hydrants: number;
  hydrant_type: string;
  flow_condition: string;
  is_test_standard: boolean;
}

export const Fire_hydrant_flow_calculatorInputSchema = z.object({
  static_pressure: z.number().min(0).max(200).default(60),
  residual_pressure: z.number().min(0).max(200).default(40),
  flow_rate_test: z.number().min(0).max(5000).default(500),
  pipe_diameter: z.number().min(2).max(24).default(6),
  pipe_length: z.number().min(0).max(10000).default(500),
  hazen_williams_coefficient: z.number().min(60).max(150).default(120),
  elevation_difference: z.number().min(-200).max(200).default(0),
  number_of_hydrants: z.number().min(1).max(10).default(1),
  hydrant_type: z.enum(['Dry barrel', 'Wet barrel', 'Wall hydrant']).default('Dry barrel'),
  flow_condition: z.enum(['Steady', 'Transient']).default('Steady'),
  is_test_standard: z.boolean().default(true),
});

function evaluateAllFormulas(input: Fire_hydrant_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.static_pressure - input.residual_pressure; results["pressure_drop_available"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_drop_available"] = 0; }
  try { const v = Math.log(input.flow_rate_test / 100) / Math.log(input.static_pressure / input.residual_pressure); results["flow_exponent"] = Number.isFinite(v) ? v : 0; } catch { results["flow_exponent"] = 0; }
  try { const v = input.flow_rate_test * ((input.static_pressure - 20) / (input.static_pressure - input.residual_pressure)) ^ (1 / n); results["available_flow"] = Number.isFinite(v) ? v : 0; } catch { results["available_flow"] = 0; }
  try { const v = 10.67 * ((results["available_flow"] ?? 0) / 100) ^ 1.852 * input.pipe_length / (input.hazen_williams_coefficient ^ 1.852 * input.pipe_diameter ^ 4.87); results["friction_loss"] = Number.isFinite(v) ? v : 0; } catch { results["friction_loss"] = 0; }
  try { const v = input.elevation_difference * 0.433; results["elevation_pressure"] = Number.isFinite(v) ? v : 0; } catch { results["elevation_pressure"] = 0; }
  try { const v = 0.4085 * (results["available_flow"] ?? 0) / (input.pipe_diameter ^ 2); results["flow_velocity"] = Number.isFinite(v) ? v : 0; } catch { results["flow_velocity"] = 0; }
  try { const v = (((results["friction_loss"] ?? 0) + Math.abs((results["elevation_pressure"] ?? 0))) / input.static_pressure) * 100; results["pressure_loss_percent"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_loss_percent"] = 0; }
  return results;
}


export function calculateFire_hydrant_flow_calculator(input: Fire_hydrant_flow_calculatorInput): Fire_hydrant_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["available_flow"] ?? 0;
  const breakdown = {
    pressure_drop_available: values["pressure_drop_available"] ?? 0,
    flow_exponent: values["flow_exponent"] ?? 0,
    friction_loss: values["friction_loss"] ?? 0,
    elevation_pressure: values["elevation_pressure"] ?? 0,
    flow_velocity: values["flow_velocity"] ?? 0,
    pressure_loss_percent: values["pressure_loss_percent"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Pipe Aging Factor","Partially Closed Valve","Turbulence at Fittings"];
  const suggestedActions: string[] = ["If available flow < 500 gpm, consider upgrading supply pipe diameter or installing a booster pump.","If pressure_loss_percent > 20%, inspect and clean supply pipe, replace if corroded.","If flow_velocity > 20 ft/s, install pressure relief valves or surge suppressors to mitigate water hammer.","Perform a full NFPA 291 flow test annually and compare with baseline to detect degradation."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-hydrant comparison","Custom threshold configuration"],
  };
}


export interface Fire_hydrant_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: { pressure_drop_available: number; flow_exponent: number; friction_loss: number; elevation_pressure: number; flow_velocity: number; pressure_loss_percent: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
