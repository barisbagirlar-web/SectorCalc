// Auto-generated from crochet-calculator-schema.json
import * as z from 'zod';

export interface Crochet_calculatorInput {
  projectWidth: number;
  projectHeight: number;
  swatchWidth: number;
  swatchHeight: number;
  swatchWeight: number;
  skeinWeight: number;
  skeinLength: number;
  yarnCostPerSkein: number;
}

export const Crochet_calculatorInputSchema = z.object({
  projectWidth: z.number().default(100),
  projectHeight: z.number().default(150),
  swatchWidth: z.number().default(10),
  swatchHeight: z.number().default(10),
  swatchWeight: z.number().default(10),
  skeinWeight: z.number().default(50),
  skeinLength: z.number().default(100),
  yarnCostPerSkein: z.number().default(5),
});

function evaluateAllFormulas(input: Crochet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil((input.projectWidth * input.projectHeight) * (input.swatchWeight / (input.swatchWidth * input.swatchHeight)) / input.skeinWeight); results["skeinsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["skeinsNeeded"] = 0; }
  try { const v = (input.projectWidth * input.projectHeight) * (input.swatchWeight / (input.swatchWidth * input.swatchHeight)); results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = ((input.projectWidth * input.projectHeight) * (input.swatchWeight / (input.swatchWidth * input.swatchHeight)) / input.skeinWeight) * input.skeinLength; results["totalMeters"] = Number.isFinite(v) ? v : 0; } catch { results["totalMeters"] = 0; }
  try { const v = Math.ceil((input.projectWidth * input.projectHeight) * (input.swatchWeight / (input.swatchWidth * input.swatchHeight)) / input.skeinWeight) * input.yarnCostPerSkein; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateCrochet_calculator(input: Crochet_calculatorInput): Crochet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["skeinsNeeded"] ?? 0;
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


export interface Crochet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
