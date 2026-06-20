// Auto-generated from worm-gear-calculator-schema.json
import * as z from 'zod';

export interface Worm_gear_calculatorInput {
  module: number;
  z1: number;
  z2: number;
  centerDistance: number;
  dataConfidence?: number;
}

export const Worm_gear_calculatorInputSchema = z.object({
  module: z.number().default(2),
  z1: z.number().default(1),
  z2: z.number().default(40),
  centerDistance: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Worm_gear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.z2 / input.z1; results["gearRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gearRatio"] = Number.NaN; }
  try { const v = input.module * input.z2; results["gearPitchDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gearPitchDiameter"] = Number.NaN; }
  try { const v = 2 * input.centerDistance - input.module * input.z2; results["wormPitchDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wormPitchDiameter"] = Number.NaN; }
  try { const v = Math.PI * input.module * input.z1; results["lead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lead"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wormPitchDiameter"])) + 2 * input.module; results["wormOuterDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wormOuterDiameter"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["gearPitchDiameter"])) + 2 * input.module; results["gearOuterDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gearOuterDiameter"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wormPitchDiameter"])) - 2.4 * input.module; results["wormRootDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wormRootDiameter"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["gearPitchDiameter"])) - 2.4 * input.module; results["gearRootDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gearRootDiameter"] = Number.NaN; }
  return results;
}


export function calculateWorm_gear_calculator(input: Worm_gear_calculatorInput): Worm_gear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gearRatio"]);
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


export interface Worm_gear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
