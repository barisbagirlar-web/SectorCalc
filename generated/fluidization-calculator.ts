// Auto-generated from fluidization-calculator-schema.json
import * as z from 'zod';

export interface Fluidization_calculatorInput {
  particleDiameter: number;
  particleDensity: number;
  fluidDensity: number;
  fluidViscosity: number;
  voidFraction: number;
  sphericity: number;
  gravity: number;
  bedHeight: number;
}

export const Fluidization_calculatorInputSchema = z.object({
  particleDiameter: z.number().default(0.001),
  particleDensity: z.number().default(2500),
  fluidDensity: z.number().default(1.2),
  fluidViscosity: z.number().default(0.000018),
  voidFraction: z.number().default(0.4),
  sphericity: z.number().default(0.8),
  gravity: z.number().default(9.81),
  bedHeight: z.number().default(0.5),
});

function evaluateAllFormulas(input: Fluidization_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.75 * (1 - input.voidFraction) / (Math.pow(input.voidFraction, 3) * input.sphericity) * (input.fluidDensity / input.particleDiameter); results["a"] = Number.isFinite(v) ? v : 0; } catch { results["a"] = 0; }
  try { const v = 150 * Math.pow(1 - input.voidFraction, 2) / (Math.pow(input.voidFraction, 3) * Math.pow(input.sphericity, 2)) * (input.fluidViscosity / Math.pow(input.particleDiameter, 2)); results["b"] = Number.isFinite(v) ? v : 0; } catch { results["b"] = 0; }
  try { const v = (input.particleDensity - input.fluidDensity) * input.gravity; results["c"] = Number.isFinite(v) ? v : 0; } catch { results["c"] = 0; }
  try { const v = (-(results["b"] ?? 0) + Math.sqrt((results["b"] ?? 0) * (results["b"] ?? 0) + 4 * (results["a"] ?? 0) * (results["c"] ?? 0))) / (2 * (results["a"] ?? 0)); results["Umf"] = Number.isFinite(v) ? v : 0; } catch { results["Umf"] = 0; }
  try { const v = (input.particleDensity - input.fluidDensity) * (1 - input.voidFraction) * input.gravity * input.bedHeight; results["DeltaP_mf"] = Number.isFinite(v) ? v : 0; } catch { results["DeltaP_mf"] = 0; }
  try { const v = input.particleDiameter * (results["Umf"] ?? 0) * input.fluidDensity / input.fluidViscosity; results["Re_mf"] = Number.isFinite(v) ? v : 0; } catch { results["Re_mf"] = 0; }
  return results;
}


export function calculateFluidization_calculator(input: Fluidization_calculatorInput): Fluidization_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Umf"] ?? 0;
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


export interface Fluidization_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
