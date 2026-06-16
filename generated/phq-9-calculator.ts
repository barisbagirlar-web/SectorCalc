// Auto-generated from phq-9-calculator-schema.json
import * as z from 'zod';

export interface Phq_9_calculatorInput {
  operating_pressure: number;
  fluid_density: number;
  flow_rate: number;
  pipe_diameter: number;
  efficiency_factor: number;
}

export const Phq_9_calculatorInputSchema = z.object({
  operating_pressure: z.number().default(100000),
  fluid_density: z.number().default(1000),
  flow_rate: z.number().default(0.01),
  pipe_diameter: z.number().default(0.1),
  efficiency_factor: z.number().default(1),
});

function evaluateAllFormulas(input: Phq_9_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operating_pressure / (input.fluid_density * 9.81); results["pressure_head"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_head"] = 0; }
  try { const v = (input.flow_rate / (Math.PI * Math.pow(input.pipe_diameter / 2, 2)))**2 / (2 * 9.81); results["velocity_head"] = Number.isFinite(v) ? v : 0; } catch { results["velocity_head"] = 0; }
  try { const v = (input.operating_pressure / (input.fluid_density * 9.81) + (input.flow_rate / (Math.PI * Math.pow(input.pipe_diameter / 2, 2)))**2 / (2 * 9.81)) * input.efficiency_factor; results["adjusted_head"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_head"] = 0; }
  return results;
}


export function calculatePhq_9_calculator(input: Phq_9_calculatorInput): Phq_9_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjusted_head"] ?? 0;
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


export interface Phq_9_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
