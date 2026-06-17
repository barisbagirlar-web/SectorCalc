// Auto-generated from excavation-calculator-schema.json
import * as z from 'zod';

export interface Excavation_calculatorInput {
  length: number;
  width: number;
  depth: number;
  swellFactor: number;
  wasteFactor: number;
}

export const Excavation_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  depth: z.number().default(2),
  swellFactor: z.number().default(25),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Excavation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.depth; results["originalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["originalVolume"] = 0; }
  try { const v = (results["originalVolume"] ?? 0) * (1 + input.swellFactor/100); results["swellVolume"] = Number.isFinite(v) ? v : 0; } catch { results["swellVolume"] = 0; }
  try { const v = (results["swellVolume"] ?? 0) * (1 + input.wasteFactor/100); results["totalExcavationVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalExcavationVolume"] = 0; }
  return results;
}


export function calculateExcavation_calculator(input: Excavation_calculatorInput): Excavation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["originalVolume"] ?? 0;
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


export interface Excavation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
