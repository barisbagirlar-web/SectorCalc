// Auto-generated from taper-calculator-schema.json
import * as z from 'zod';

export interface Taper_calculatorInput {
  largeDiameter: number;
  smallDiameter: number;
  length: number;
  referenceLength: number;
}

export const Taper_calculatorInputSchema = z.object({
  largeDiameter: z.number().default(100),
  smallDiameter: z.number().default(50),
  length: z.number().default(200),
  referenceLength: z.number().default(100),
});

function evaluateAllFormulas(input: Taper_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.largeDiameter - input.smallDiameter) / input.length; results["taperRatio"] = Number.isFinite(v) ? v : 0; } catch { results["taperRatio"] = 0; }
  try { const v = ((input.largeDiameter - input.smallDiameter) / input.length) * input.referenceLength; results["taperPerRefLength"] = Number.isFinite(v) ? v : 0; } catch { results["taperPerRefLength"] = 0; }
  try { const v = 2 * Math.atan((input.largeDiameter - input.smallDiameter) / (2 * input.length)) * (180 / Math.PI); results["taperAngleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["taperAngleDeg"] = 0; }
  return results;
}


export function calculateTaper_calculator(input: Taper_calculatorInput): Taper_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["taperRatio"] ?? 0;
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


export interface Taper_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
