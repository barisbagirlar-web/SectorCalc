// Auto-generated from rectangular-tank-volume-calculator-schema.json
import * as z from 'zod';

export interface Rectangular_tank_volume_calculatorInput {
  outerLength: number;
  outerWidth: number;
  outerHeight: number;
  wallThickness: number;
  fillLevel: number;
}

export const Rectangular_tank_volume_calculatorInputSchema = z.object({
  outerLength: z.number().default(2),
  outerWidth: z.number().default(1.5),
  outerHeight: z.number().default(1),
  wallThickness: z.number().default(0.05),
  fillLevel: z.number().default(0.8),
});

function evaluateAllFormulas(input: Rectangular_tank_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outerLength * input.outerWidth * input.outerHeight; results["outerVolume"] = Number.isFinite(v) ? v : 0; } catch { results["outerVolume"] = 0; }
  try { const v = (input.outerLength - 2*input.wallThickness) * (input.outerWidth - 2*input.wallThickness) * (input.outerHeight - 2*input.wallThickness); results["innerVolume"] = Number.isFinite(v) ? v : 0; } catch { results["innerVolume"] = 0; }
  try { const v = (results["outerVolume"] ?? 0) - (results["innerVolume"] ?? 0); results["materialVolume"] = Number.isFinite(v) ? v : 0; } catch { results["materialVolume"] = 0; }
  try { const v = (input.outerLength - 2*input.wallThickness) * (input.outerWidth - 2*input.wallThickness) * Math.min(input.fillLevel, input.outerHeight - 2*input.wallThickness); results["filledVolume"] = Number.isFinite(v) ? v : 0; } catch { results["filledVolume"] = 0; }
  return results;
}


export function calculateRectangular_tank_volume_calculator(input: Rectangular_tank_volume_calculatorInput): Rectangular_tank_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["filledVolume"] ?? 0;
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


export interface Rectangular_tank_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
