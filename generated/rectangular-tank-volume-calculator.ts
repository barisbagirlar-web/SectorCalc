// Auto-generated from rectangular-tank-volume-calculator-schema.json
import * as z from 'zod';

export interface Rectangular_tank_volume_calculatorInput {
  outerLength: number;
  outerWidth: number;
  outerHeight: number;
  wallThickness: number;
  fillLevel: number;
  dataConfidence?: number;
}

export const Rectangular_tank_volume_calculatorInputSchema = z.object({
  outerLength: z.number().default(2),
  outerWidth: z.number().default(1.5),
  outerHeight: z.number().default(1),
  wallThickness: z.number().default(0.05),
  fillLevel: z.number().default(0.8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rectangular_tank_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outerLength * input.outerWidth * input.outerHeight; results["outerVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outerVolume"] = Number.NaN; }
  try { const v = (input.outerLength - 2*input.wallThickness) * (input.outerWidth - 2*input.wallThickness) * (input.outerHeight - 2*input.wallThickness); results["innerVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["innerVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["outerVolume"])) - (toNumericFormulaValue(results["innerVolume"])); results["materialVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialVolume"] = Number.NaN; }
  return results;
}


export function calculateRectangular_tank_volume_calculator(input: Rectangular_tank_volume_calculatorInput): Rectangular_tank_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["materialVolume"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
