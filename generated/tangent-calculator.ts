// Auto-generated from tangent-calculator-schema.json
import * as z from 'zod';

export interface Tangent_calculatorInput {
  angle: number;
  unitRadians: number;
  precision: number;
  computeDouble: number;
}

export const Tangent_calculatorInputSchema = z.object({
  angle: z.number().default(45),
  unitRadians: z.number().default(0),
  precision: z.number().default(4),
  computeDouble: z.number().default(0),
});

function evaluateAllFormulas(input: Tangent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.unitRadians == 1) ? input.angle : input.angle * Math.PI / 180; results["thetaRad"] = Number.isFinite(v) ? v : 0; } catch { results["thetaRad"] = 0; }
  try { const v = (input.computeDouble == 1) ? 2 * (results["thetaRad"] ?? 0) : (results["thetaRad"] ?? 0); results["effectiveAngle"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAngle"] = 0; }
  try { const v = Math.tan((results["effectiveAngle"] ?? 0)); results["tanExact"] = Number.isFinite(v) ? v : 0; } catch { results["tanExact"] = 0; }
  try { const v = Math.round((results["tanExact"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedTan"] = Number.isFinite(v) ? v : 0; } catch { results["roundedTan"] = 0; }
  try { const v = Math.sin((results["effectiveAngle"] ?? 0)); results["sinValue"] = Number.isFinite(v) ? v : 0; } catch { results["sinValue"] = 0; }
  try { const v = Math.cos((results["effectiveAngle"] ?? 0)); results["cosValue"] = Number.isFinite(v) ? v : 0; } catch { results["cosValue"] = 0; }
  return results;
}


export function calculateTangent_calculator(input: Tangent_calculatorInput): Tangent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedTan"] ?? 0;
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


export interface Tangent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
