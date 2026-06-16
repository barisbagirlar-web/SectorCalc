// Auto-generated from pipe-thickness-calculator-schema.json
import * as z from 'zod';

export interface Pipe_thickness_calculatorInput {
  pressure: number;
  diameter: number;
  allowableStress: number;
  jointEfficiency: number;
  corrosionAllowance: number;
}

export const Pipe_thickness_calculatorInputSchema = z.object({
  pressure: z.number().default(1),
  diameter: z.number().default(100),
  allowableStress: z.number().default(138),
  jointEfficiency: z.number().default(1),
  corrosionAllowance: z.number().default(1.5),
});

function evaluateAllFormulas(input: Pipe_thickness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.pressure * input.diameter) / (2 * input.allowableStress * input.jointEfficiency) + input.corrosionAllowance; results["requiredThickness"] = Number.isFinite(v) ? v : 0; } catch { results["requiredThickness"] = 0; }
  return results;
}


export function calculatePipe_thickness_calculator(input: Pipe_thickness_calculatorInput): Pipe_thickness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredThickness"] ?? 0;
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


export interface Pipe_thickness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
