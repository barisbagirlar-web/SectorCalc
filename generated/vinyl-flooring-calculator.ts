// Auto-generated from vinyl-flooring-calculator-schema.json
import * as z from 'zod';

export interface Vinyl_flooring_calculatorInput {
  roomLength: number;
  roomWidth: number;
  plankLength: number;
  plankWidth: number;
  wasteFactor: number;
  plankPrice: number;
}

export const Vinyl_flooring_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  plankLength: z.number().default(1.2),
  plankWidth: z.number().default(0.2),
  wasteFactor: z.number().default(10),
  plankPrice: z.number().default(15),
});

function evaluateAllFormulas(input: Vinyl_flooring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth; results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (results["totalArea"] ?? 0) * (1 + input.wasteFactor / 100); results["effectiveArea"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveArea"] = 0; }
  try { const v = (results["effectiveArea"] ?? 0) / (input.plankLength * input.plankWidth); results["numberOfPlanks"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPlanks"] = 0; }
  try { const v = (results["effectiveArea"] ?? 0) * input.plankPrice; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateVinyl_flooring_calculator(input: Vinyl_flooring_calculatorInput): Vinyl_flooring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Vinyl_flooring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
