// Auto-generated from spring-rate-calculator-schema.json
import * as z from 'zod';

export interface Spring_rate_calculatorInput {
  wireDiameter: number;
  meanCoilDiameter: number;
  activeCoils: number;
  shearModulus: number;
}

export const Spring_rate_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(1),
  meanCoilDiameter: z.number().default(10),
  activeCoils: z.number().default(10),
  shearModulus: z.number().default(79.3),
});

function evaluateAllFormulas(input: Spring_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.shearModulus * 1000 * input.wireDiameter**4) / (8 * input.meanCoilDiameter**3 * input.activeCoils); results["springRate"] = Number.isFinite(v) ? v : 0; } catch { results["springRate"] = 0; }
  try { const v = (G * d**4) / (8 * D**3 * N); results["k____G___d_4_____8___D_3___N_"] = Number.isFinite(v) ? v : 0; } catch { results["k____G___d_4_____8___D_3___N_"] = 0; }
  try { const v = input.shearModulus * 1000; results["shearModulus___1000"] = Number.isFinite(v) ? v : 0; } catch { results["shearModulus___1000"] = 0; }
  try { const v = (G_MPa * d**4) / (8 * D**3 * N); results["k____G_MPa___d_4_____8___D_3___N_"] = Number.isFinite(v) ? v : 0; } catch { results["k____G_MPa___d_4_____8___D_3___N_"] = 0; }
  results["springRate_N_mm"] = 0;
  return results;
}


export function calculateSpring_rate_calculator(input: Spring_rate_calculatorInput): Spring_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["springRate"] ?? 0;
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


export interface Spring_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
