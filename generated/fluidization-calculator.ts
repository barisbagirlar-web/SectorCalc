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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fluidization_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.particleDensity - input.fluidDensity) * input.gravity; results["c"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["c"] = 0; }
  try { const v = (input.particleDensity - input.fluidDensity) * (1 - input.voidFraction) * input.gravity * input.bedHeight; results["DeltaP_mf"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["DeltaP_mf"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFluidization_calculator(input: Fluidization_calculatorInput): Fluidization_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["DeltaP_mf"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
