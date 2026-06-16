// Auto-generated from metalworking-calculator-schema.json
import * as z from 'zod';

export interface Metalworking_calculatorInput {
  spindleSpeed: number;
  toolDiameter: number;
  numberFlutes: number;
  chipLoad: number;
  axialDepthOfCut: number;
  radialWidthOfCut: number;
}

export const Metalworking_calculatorInputSchema = z.object({
  spindleSpeed: z.number().default(1500),
  toolDiameter: z.number().default(10),
  numberFlutes: z.number().default(4),
  chipLoad: z.number().default(0.1),
  axialDepthOfCut: z.number().default(5),
  radialWidthOfCut: z.number().default(5),
});

function evaluateAllFormulas(input: Metalworking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * input.toolDiameter * input.spindleSpeed / 1000; results["cuttingSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["cuttingSpeed"] = 0; }
  try { const v = input.numberFlutes * input.chipLoad * input.spindleSpeed; results["feedRate"] = Number.isFinite(v) ? v : 0; } catch { results["feedRate"] = 0; }
  try { const v = input.numberFlutes * input.chipLoad * input.spindleSpeed * input.axialDepthOfCut * input.radialWidthOfCut; results["materialRemovalRate"] = Number.isFinite(v) ? v : 0; } catch { results["materialRemovalRate"] = 0; }
  return results;
}


export function calculateMetalworking_calculator(input: Metalworking_calculatorInput): Metalworking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["materialRemovalRate"] ?? 0;
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


export interface Metalworking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
