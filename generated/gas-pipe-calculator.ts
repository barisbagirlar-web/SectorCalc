// Auto-generated from gas-pipe-calculator-schema.json
import * as z from 'zod';

export interface Gas_pipe_calculatorInput {
  diameter_mm: number;
  length_m: number;
  inlet_pressure_bar: number;
  outlet_pressure_bar: number;
  temperature_celsius: number;
  specific_gravity: number;
  dataConfidence?: number;
}

export const Gas_pipe_calculatorInputSchema = z.object({
  diameter_mm: z.number().default(150),
  length_m: z.number().default(1000),
  inlet_pressure_bar: z.number().default(10),
  outlet_pressure_bar: z.number().default(5),
  temperature_celsius: z.number().default(15),
  specific_gravity: z.number().default(0.6),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gas_pipe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.diameter_mm / 25.4; results["diameter_inch"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["diameter_inch"] = 0; }
  try { const v = input.temperature_celsius + 273.15; results["temperature_K"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["temperature_K"] = 0; }
  try { const v = input.inlet_pressure_bar - input.outlet_pressure_bar; results["pressure_drop_bar"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressure_drop_bar"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGas_pipe_calculator(input: Gas_pipe_calculatorInput): Gas_pipe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressure_drop_bar"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
