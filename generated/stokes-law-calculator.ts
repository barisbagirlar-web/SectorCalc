// Auto-generated from stokes-law-calculator-schema.json
import * as z from 'zod';

export interface Stokes_law_calculatorInput {
  particleDensity: number;
  fluidDensity: number;
  dynamicViscosity: number;
  particleDiameter: number;
  gravity: number;
}

export const Stokes_law_calculatorInputSchema = z.object({
  particleDensity: z.number().default(2500),
  fluidDensity: z.number().default(1000),
  dynamicViscosity: z.number().default(0.001),
  particleDiameter: z.number().default(0.001),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Stokes_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.particleDensity - input.fluidDensity; results["densityDifference"] = Number.isFinite(v) ? v : 0; } catch { results["densityDifference"] = 0; }
  try { const v = input.particleDiameter / 2; results["particleRadius"] = Number.isFinite(v) ? v : 0; } catch { results["particleRadius"] = 0; }
  try { const v = (2/9) * (results["densityDifference"] ?? 0) * input.gravity * (results["particleRadius"] ?? 0) ** 2 / input.dynamicViscosity; results["settlingVelocity"] = Number.isFinite(v) ? v : 0; } catch { results["settlingVelocity"] = 0; }
  return results;
}


export function calculateStokes_law_calculator(input: Stokes_law_calculatorInput): Stokes_law_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["settlingVelocity"] ?? 0;
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


export interface Stokes_law_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
