// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fluidization_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.particleDensity - input.fluidDensity) * input.gravity; results["c"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["c"] = 0; }
  try { const v = (input.particleDensity - input.fluidDensity) * (1 - input.voidFraction) * input.gravity * input.bedHeight; results["DeltaP_mf"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["DeltaP_mf"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFluidization_calculator(input: Fluidization_calculatorInput): Fluidization_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["DeltaP_mf"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
