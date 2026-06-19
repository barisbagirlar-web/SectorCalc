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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pipe_insulation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pipe_outer_diameter / 2000; results["r1_m"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["r1_m"] = 0; }
  try { const v = (asFormulaNumber(results["r1_m"])) + input.insulation_thickness / 1000; results["r2_m"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["r2_m"] = 0; }
  try { const v = 1 / (2 * Math.PI * (asFormulaNumber(results["r2_m"])) * input.pipe_length * input.convection_coefficient); results["R_convection"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["R_convection"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePipe_insulation_calculator(input: Pipe_insulation_calculatorInput): Pipe_insulation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["R_convection"]);
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


export interface Pipe_insulation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
