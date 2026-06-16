// Auto-generated from gravel-calculator-schema.json
import * as z from 'zod';

export interface Gravel_calculatorInput {
  length: number;
  width: number;
  depth: number;
  compactionFactor: number;
  wasteFactor: number;
  density: number;
}

export const Gravel_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(10),
  depth: z.number().default(2),
  compactionFactor: z.number().default(5),
  wasteFactor: z.number().default(10),
  density: z.number().default(120),
});

function evaluateAllFormulas(input: Gravel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * (input.depth / 12); results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (results["volume"] ?? 0) * (1 + input.compactionFactor / 100) * (1 + input.wasteFactor / 100); results["adjustedVolume"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedVolume"] = 0; }
  try { const v = (results["adjustedVolume"] ?? 0) * input.density / 2000; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = (results["adjustedVolume"] ?? 0) / 27; results["cubicYards"] = Number.isFinite(v) ? v : 0; } catch { results["cubicYards"] = 0; }
  return results;
}


export function calculateGravel_calculator(input: Gravel_calculatorInput): Gravel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["{primary} tons"] ?? 0;
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


export interface Gravel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
