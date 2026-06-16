// Auto-generated from pipe-insulation-calculator-schema.json
import * as z from 'zod';

export interface Pipe_insulation_calculatorInput {
  pipe_outer_diameter: number;
  insulation_thickness: number;
  pipe_length: number;
  thermal_conductivity: number;
  inner_temperature: number;
  ambient_temperature: number;
  convection_coefficient: number;
}

export const Pipe_insulation_calculatorInputSchema = z.object({
  pipe_outer_diameter: z.number().default(100),
  insulation_thickness: z.number().default(50),
  pipe_length: z.number().default(10),
  thermal_conductivity: z.number().default(0.035),
  inner_temperature: z.number().default(150),
  ambient_temperature: z.number().default(25),
  convection_coefficient: z.number().default(10),
});

function evaluateAllFormulas(input: Pipe_insulation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pipe_outer_diameter / 2000; results["r1_m"] = Number.isFinite(v) ? v : 0; } catch { results["r1_m"] = 0; }
  try { const v = (results["r1_m"] ?? 0) + input.insulation_thickness / 1000; results["r2_m"] = Number.isFinite(v) ? v : 0; } catch { results["r2_m"] = 0; }
  try { const v = Math.log((results["r2_m"] ?? 0) / (results["r1_m"] ?? 0)) / (2 * Math.PI * input.pipe_length * input.thermal_conductivity); results["R_insulation"] = Number.isFinite(v) ? v : 0; } catch { results["R_insulation"] = 0; }
  try { const v = 1 / (2 * Math.PI * (results["r2_m"] ?? 0) * input.pipe_length * input.convection_coefficient); results["R_convection"] = Number.isFinite(v) ? v : 0; } catch { results["R_convection"] = 0; }
  try { const v = (results["R_insulation"] ?? 0) + (results["R_convection"] ?? 0); results["R_total"] = Number.isFinite(v) ? v : 0; } catch { results["R_total"] = 0; }
  try { const v = (input.inner_temperature - input.ambient_temperature) / (results["R_total"] ?? 0); results["heat_loss"] = Number.isFinite(v) ? v : 0; } catch { results["heat_loss"] = 0; }
  try { const v = input.ambient_temperature + (results["heat_loss"] ?? 0) * (results["R_convection"] ?? 0); results["surface_temperature"] = Number.isFinite(v) ? v : 0; } catch { results["surface_temperature"] = 0; }
  try { const v = (results["heat_loss"] ?? 0) / input.pipe_length; results["heat_loss_per_meter"] = Number.isFinite(v) ? v : 0; } catch { results["heat_loss_per_meter"] = 0; }
  return results;
}


export function calculatePipe_insulation_calculator(input: Pipe_insulation_calculatorInput): Pipe_insulation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["heat_loss"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    premiumFeatures: [],
  };
}


export interface Pipe_insulation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
