// Auto-generated from spur-gear-calculator-schema.json
import * as z from 'zod';

export interface Spur_gear_calculatorInput {
  module: number;
  teeth: number;
  pressureAngle: number;
  addendumCoeff: number;
  dedendumCoeff: number;
}

export const Spur_gear_calculatorInputSchema = z.object({
  module: z.number().default(1),
  teeth: z.number().default(20),
  pressureAngle: z.number().default(20),
  addendumCoeff: z.number().default(1),
  dedendumCoeff: z.number().default(1.25),
});

function evaluateAllFormulas(input: Spur_gear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.module * input.teeth; results["pitchDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["pitchDiameter"] = 0; }
  try { const v = input.module * (input.teeth + 2 * input.addendumCoeff); results["outsideDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["outsideDiameter"] = 0; }
  try { const v = input.module * (input.teeth - 2 * input.dedendumCoeff); results["rootDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["rootDiameter"] = 0; }
  try { const v = input.module * input.teeth * Math.cos(input.pressureAngle * Math.PI / 180); results["baseCircleDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["baseCircleDiameter"] = 0; }
  try { const v = Math.PI * input.module; results["circularPitch"] = Number.isFinite(v) ? v : 0; } catch { results["circularPitch"] = 0; }
  try { const v = (Math.PI * input.module) / 2; results["toothThickness"] = Number.isFinite(v) ? v : 0; } catch { results["toothThickness"] = 0; }
  return results;
}


export function calculateSpur_gear_calculator(input: Spur_gear_calculatorInput): Spur_gear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pitchDiameter"] ?? 0;
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


export interface Spur_gear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
