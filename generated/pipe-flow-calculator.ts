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
  dataConfidence?: number;
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
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pipe_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pipe_diameter * input.pipe_length * (input.flow_rate / 100) * input.fluid_density; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.pipe_diameter * input.pipe_length * (input.flow_rate / 100) * input.fluid_density * (input.fluid_viscosity * input.roughness * input.elevation_change * input.minor_loss_coefficient); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.fluid_viscosity * input.roughness * input.elevation_change * input.minor_loss_coefficient; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculatePipe_flow_calculator(input: Pipe_flow_calculatorInput): Pipe_flow_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Customizable unit system","Multi-scenario comparison"],
  };
}


export interface Pipe_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
