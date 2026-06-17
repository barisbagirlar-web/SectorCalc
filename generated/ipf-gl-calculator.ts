// Auto-generated from ipf-gl-calculator-schema.json
import * as z from 'zod';

export interface Ipf_gl_calculatorInput {
  thermal_conductivity: number;
  thickness: number;
  area: number;
  temp_hot: number;
  temp_cold: number;
  u_target: number;
}

export const Ipf_gl_calculatorInputSchema = z.object({
  thermal_conductivity: z.number().default(0.04),
  thickness: z.number().default(100),
  area: z.number().default(10),
  temp_hot: z.number().default(80),
  temp_cold: z.number().default(20),
  u_target: z.number().default(0.5),
});

function evaluateAllFormulas(input: Ipf_gl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.thermal_conductivity * 1000) / input.thickness; results["u_actual"] = Number.isFinite(v) ? v : 0; } catch { results["u_actual"] = 0; }
  try { const v = input.u_target / ((input.thermal_conductivity * 1000) / input.thickness); results["ipf"] = Number.isFinite(v) ? v : 0; } catch { results["ipf"] = 0; }
  try { const v = ((input.thermal_conductivity * 1000) / input.thickness) * input.area * (input.temp_hot - input.temp_cold); results["heat_loss"] = Number.isFinite(v) ? v : 0; } catch { results["heat_loss"] = 0; }
  return results;
}


export function calculateIpf_gl_calculator(input: Ipf_gl_calculatorInput): Ipf_gl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ipf"] ?? 0;
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


export interface Ipf_gl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
