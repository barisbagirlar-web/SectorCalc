// Auto-generated from spray-paint-calculator-schema.json
import * as z from 'zod';

export interface Spray_paint_calculatorInput {
  area: number;
  coverage: number;
  coats: number;
  wasteFactor: number;
  canVolume: number;
}

export const Spray_paint_calculatorInputSchema = z.object({
  area: z.number().default(10),
  coverage: z.number().default(10),
  coats: z.number().default(1),
  wasteFactor: z.number().default(10),
  canVolume: z.number().default(0.4),
});

function evaluateAllFormulas(input: Spray_paint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverage * (1 - input.wasteFactor / 100); results["effectiveCoverage"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveCoverage"] = 0; }
  try { const v = (input.area * input.coats) / (results["effectiveCoverage"] ?? 0); results["totalPaintVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalPaintVolume"] = 0; }
  try { const v = Math.ceil((results["totalPaintVolume"] ?? 0) / input.canVolume); results["cansRequired"] = Number.isFinite(v) ? v : 0; } catch { results["cansRequired"] = 0; }
  return results;
}


export function calculateSpray_paint_calculator(input: Spray_paint_calculatorInput): Spray_paint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cansRequired"] ?? 0;
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


export interface Spray_paint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
