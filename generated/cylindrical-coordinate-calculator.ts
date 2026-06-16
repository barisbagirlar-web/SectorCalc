// Auto-generated from cylindrical-coordinate-calculator-schema.json
import * as z from 'zod';

export interface Cylindrical_coordinate_calculatorInput {
  direction: number;
  r: number;
  theta: number;
  x: number;
  y: number;
  z: number;
}

export const Cylindrical_coordinate_calculatorInputSchema = z.object({
  direction: z.number().default(0),
  r: z.number().default(0),
  theta: z.number().default(0),
  x: z.number().default(0),
  y: z.number().default(0),
  z: z.number().default(0),
});

function evaluateAllFormulas(input: Cylindrical_coordinate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.theta * Math.PI / 180; results["thetaRad"] = Number.isFinite(v) ? v : 0; } catch { results["thetaRad"] = 0; }
  try { const v = input.r * Math.cos((results["thetaRad"] ?? 0)); results["xResult"] = Number.isFinite(v) ? v : 0; } catch { results["xResult"] = 0; }
  try { const v = input.r * Math.sin((results["thetaRad"] ?? 0)); results["yResult"] = Number.isFinite(v) ? v : 0; } catch { results["yResult"] = 0; }
  try { const v = Math.sqrt(input.x**2 + input.y**2); results["rResult"] = Number.isFinite(v) ? v : 0; } catch { results["rResult"] = 0; }
  try { const v = Math.atan2(input.y, input.x) * 180 / Math.PI; results["thetaDeg"] = Number.isFinite(v) ? v : 0; } catch { results["thetaDeg"] = 0; }
  return results;
}


export function calculateCylindrical_coordinate_calculator(input: Cylindrical_coordinate_calculatorInput): Cylindrical_coordinate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["direction"] ?? 0;
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


export interface Cylindrical_coordinate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
