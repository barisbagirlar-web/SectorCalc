// Auto-generated from cut-calculator-schema.json
import * as z from 'zod';

export interface Cut_calculatorInput {
  cuttingSpeed: number;
  feedPerTooth: number;
  numberOfTeeth: number;
  toolDiameter: number;
  depthOfCut: number;
  widthOfCut: number;
}

export const Cut_calculatorInputSchema = z.object({
  cuttingSpeed: z.number().default(150),
  feedPerTooth: z.number().default(0.15),
  numberOfTeeth: z.number().default(4),
  toolDiameter: z.number().default(12),
  depthOfCut: z.number().default(5),
  widthOfCut: z.number().default(8),
});

function evaluateAllFormulas(input: Cut_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cuttingSpeed * 1000) / (Math.PI * input.toolDiameter); results["spindleSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["spindleSpeed"] = 0; }
  try { const v = input.feedPerTooth * input.numberOfTeeth * (results["spindleSpeed"] ?? 0); results["feedRate"] = Number.isFinite(v) ? v : 0; } catch { results["feedRate"] = 0; }
  try { const v = (input.depthOfCut * input.widthOfCut * (results["feedRate"] ?? 0)) / 1000; results["materialRemovalRate"] = Number.isFinite(v) ? v : 0; } catch { results["materialRemovalRate"] = 0; }
  return results;
}


export function calculateCut_calculator(input: Cut_calculatorInput): Cut_calculatorOutput {
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


export interface Cut_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
