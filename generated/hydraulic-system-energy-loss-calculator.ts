// Auto-generated from hydraulic-system-energy-loss-calculator-schema.json
import * as z from 'zod';

export interface Hydraulic_system_energy_loss_calculatorInput {
  flow_rate: number;
  pressure_drop_total: number;
  fluid_density: number;
  kinematic_viscosity: number;
  pipe_length: number;
  pipe_diameter: number;
  valve_count: number;
  fitting_count: number;
  dataConfidence?: number;
}

export const Hydraulic_system_energy_loss_calculatorInputSchema = z.object({
  flow_rate: z.number().min(0).max(10000).default(100),
  pressure_drop_total: z.number().min(0).max(500).default(50),
  fluid_density: z.number().min(700).max(1200).default(870),
  kinematic_viscosity: z.number().min(10).max(500).default(46),
  pipe_length: z.number().min(0).max(1000).default(50),
  pipe_diameter: z.number().min(5).max(200).default(25),
  valve_count: z.number().min(0).max(50).default(5),
  fitting_count: z.number().min(0).max(200).default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hydraulic_system_energy_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.flow_rate / 100) * input.pressure_drop_total * input.fluid_density * input.kinematic_viscosity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = (input.flow_rate / 100) * input.pressure_drop_total * input.fluid_density * input.kinematic_viscosity * (input.pipe_length * input.pipe_diameter * input.valve_count * input.fitting_count); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.pipe_length * input.pipe_diameter * input.valve_count * input.fitting_count; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHydraulic_system_energy_loss_calculator(input: Hydraulic_system_energy_loss_calculatorInput): Hydraulic_system_energy_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Hydraulic_system_energy_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
