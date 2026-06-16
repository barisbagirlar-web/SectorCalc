// Auto-generated from cone-volume-calculator-schema.json
import * as z from 'zod';

export interface Cone_volume_calculatorInput {
  radius: number;
  height: number;
  slantHeight: number;
  diameter: number;
  precision: number;
  calcSurface: number;
}

export const Cone_volume_calculatorInputSchema = z.object({
  radius: z.number().default(1),
  height: z.number().default(2),
  slantHeight: z.number().default(0),
  diameter: z.number().default(0),
  precision: z.number().default(2),
  calcSurface: z.number().default(0),
});

function evaluateAllFormulas(input: Cone_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Number(((1/3) * Math.PI * (input.diameter > 0 ? input.diameter/2 : input.radius)**2 * input.height).toFixed(input.precision)); results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = Number((Math.PI * (input.diameter > 0 ? input.diameter/2 : input.radius) * (input.slantHeight > 0 ? input.slantHeight : Math.sqrt((input.diameter > 0 ? input.diameter/2 : input.radius)**2 + input.height**2))).toFixed(input.precision)); results["lateralSurface"] = Number.isFinite(v) ? v : 0; } catch { results["lateralSurface"] = 0; }
  try { const v = Number((Math.PI * (input.diameter > 0 ? input.diameter/2 : input.radius) * ((input.diameter > 0 ? input.diameter/2 : input.radius) + (input.slantHeight > 0 ? input.slantHeight : Math.sqrt((input.diameter > 0 ? input.diameter/2 : input.radius)**2 + input.height**2)))).toFixed(input.precision)); results["totalSurface"] = Number.isFinite(v) ? v : 0; } catch { results["totalSurface"] = 0; }
  return results;
}


export function calculateCone_volume_calculator(input: Cone_volume_calculatorInput): Cone_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["volume"] ?? 0;
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


export interface Cone_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
