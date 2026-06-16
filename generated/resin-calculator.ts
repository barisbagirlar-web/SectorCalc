// Auto-generated from resin-calculator-schema.json
import * as z from 'zod';

export interface Resin_calculatorInput {
  area: number;
  thickness: number;
  resinRatio: number;
  hardenerRatio: number;
  resinDensity: number;
  hardenerDensity: number;
  wasteFactor: number;
}

export const Resin_calculatorInputSchema = z.object({
  area: z.number().default(1),
  thickness: z.number().default(1),
  resinRatio: z.number().default(100),
  hardenerRatio: z.number().default(50),
  resinDensity: z.number().default(1.1),
  hardenerDensity: z.number().default(0.95),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Resin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.thickness; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = ((results["totalVolume"] ?? 0) / ((input.resinRatio / input.hardenerRatio) / input.resinDensity + 1 / input.hardenerDensity)) * (input.resinRatio / input.hardenerRatio) * (1 + input.wasteFactor / 100); results["resinWeight"] = Number.isFinite(v) ? v : 0; } catch { results["resinWeight"] = 0; }
  try { const v = ((results["totalVolume"] ?? 0) / ((input.resinRatio / input.hardenerRatio) / input.resinDensity + 1 / input.hardenerDensity)) * (1 + input.wasteFactor / 100); results["hardenerWeight"] = Number.isFinite(v) ? v : 0; } catch { results["hardenerWeight"] = 0; }
  try { const v = (results["resinWeight"] ?? 0) / input.resinDensity; results["resinVolume"] = Number.isFinite(v) ? v : 0; } catch { results["resinVolume"] = 0; }
  try { const v = (results["hardenerWeight"] ?? 0) / input.hardenerDensity; results["hardenerVolume"] = Number.isFinite(v) ? v : 0; } catch { results["hardenerVolume"] = 0; }
  try { const v = (results["resinWeight"] ?? 0) + (results["hardenerWeight"] ?? 0); results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


export function calculateResin_calculator(input: Resin_calculatorInput): Resin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeight"] ?? 0;
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


export interface Resin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
