// Auto-generated from gas-pipe-calculator-schema.json
import * as z from 'zod';

export interface Gas_pipe_calculatorInput {
  diameter_mm: number;
  length_m: number;
  inlet_pressure_bar: number;
  outlet_pressure_bar: number;
  temperature_celsius: number;
  specific_gravity: number;
}

export const Gas_pipe_calculatorInputSchema = z.object({
  diameter_mm: z.number().default(150),
  length_m: z.number().default(1000),
  inlet_pressure_bar: z.number().default(10),
  outlet_pressure_bar: z.number().default(5),
  temperature_celsius: z.number().default(15),
  specific_gravity: z.number().default(0.6),
});

function evaluateAllFormulas(input: Gas_pipe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.diameter_mm / 25.4; results["diameter_inch"] = Number.isFinite(v) ? v : 0; } catch { results["diameter_inch"] = 0; }
  try { const v = input.temperature_celsius + 273.15; results["temperature_K"] = Number.isFinite(v) ? v : 0; } catch { results["temperature_K"] = 0; }
  try { const v = input.inlet_pressure_bar - input.outlet_pressure_bar; results["pressure_drop_bar"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_drop_bar"] = 0; }
  try { const v = 0.5 * (input.diameter_mm / 25.4) ** 2.5 * Math.sqrt( (input.inlet_pressure_bar ** 2 - input.outlet_pressure_bar ** 2) / (input.length_m * input.specific_gravity * (input.temperature_celsius + 273.15)) ); results["flow_rate_m3h"] = Number.isFinite(v) ? v : 0; } catch { results["flow_rate_m3h"] = 0; }
  return results;
}


export function calculateGas_pipe_calculator(input: Gas_pipe_calculatorInput): Gas_pipe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["flow_rate_m3h"] ?? 0;
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


export interface Gas_pipe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
