// Auto-generated from sedimentation-calculator-schema.json
import * as z from 'zod';

export interface Sedimentation_calculatorInput {
  particleDiameter: number;
  particleDensity: number;
  fluidDensity: number;
  fluidViscosity: number;
  flowRate: number;
  basinLength: number;
  basinWidth: number;
  basinDepth: number;
  dataConfidence?: number;
}

export const Sedimentation_calculatorInputSchema = z.object({
  particleDiameter: z.number().default(0.0001),
  particleDensity: z.number().default(2600),
  fluidDensity: z.number().default(1000),
  fluidViscosity: z.number().default(0.001),
  flowRate: z.number().default(0.1),
  basinLength: z.number().default(20),
  basinWidth: z.number().default(5),
  basinDepth: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sedimentation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((9.81) * (input.particleDensity - input.fluidDensity) * (input.particleDiameter ** 2)) / (18 * input.fluidViscosity); results["settlingVelocity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["settlingVelocity"] = 0; }
  try { const v = input.flowRate / (input.basinLength * input.basinWidth); results["overflowRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overflowRate"] = 0; }
  try { const v = (input.basinLength * input.basinWidth * input.basinDepth) / input.flowRate; results["detentionTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["detentionTime"] = 0; }
  try { const v = (input.fluidDensity * ((9.81) * (input.particleDensity - input.fluidDensity) * (input.particleDiameter ** 2)) / (18 * input.fluidViscosity) * input.particleDiameter) / input.fluidViscosity; results["reynoldsNumber"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reynoldsNumber"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSedimentation_calculator(input: Sedimentation_calculatorInput): Sedimentation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["overflowRate"]));
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


export interface Sedimentation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
