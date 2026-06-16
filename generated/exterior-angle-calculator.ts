// Auto-generated from exterior-angle-calculator-schema.json
import * as z from 'zod';

export interface Exterior_angle_calculatorInput {
  sides: number;
  interiorAngle: number;
  sumInteriorAngles: number;
  exteriorAngleGiven: number;
  precision: number;
}

export const Exterior_angle_calculatorInputSchema = z.object({
  sides: z.number().default(0),
  interiorAngle: z.number().default(0),
  sumInteriorAngles: z.number().default(0),
  exteriorAngleGiven: z.number().default(0),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Exterior_angle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round((input.sides > 0 ? 360/input.sides : input.interiorAngle > 0 ? 180 - input.interiorAngle : input.sumInteriorAngles > 0 ? 360/((input.sumInteriorAngles/180)+2) : input.exteriorAngleGiven > 0 ? input.exteriorAngleGiven : 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["exteriorAngle"] = Number.isFinite(v) ? v : 0; } catch { results["exteriorAngle"] = 0; }
  try { const v = Math.round((180 - (results["exteriorAngle"] ?? 0)) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["interiorAngle"] = Number.isFinite(v) ? v : 0; } catch { results["interiorAngle"] = 0; }
  try { const v = Math.round(360 * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["sumExteriorAngles"] = Number.isFinite(v) ? v : 0; } catch { results["sumExteriorAngles"] = 0; }
  return results;
}


export function calculateExterior_angle_calculator(input: Exterior_angle_calculatorInput): Exterior_angle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["exteriorAngle"] ?? 0;
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


export interface Exterior_angle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
