// Auto-generated from surface-area-integral-schema.json
import * as z from 'zod';

export interface Surface_area_integralInput {
  radius: number;
  height: number;
  shape: number;
  theta_min: number;
  theta_max: number;
  phi_min: number;
  phi_max: number;
  dataConfidence?: number;
}

export const Surface_area_integralInputSchema = z.object({
  radius: z.number().default(1),
  height: z.number().default(1),
  shape: z.number().default(0),
  theta_min: z.number().default(0),
  theta_max: z.number().default(3.141592653589793),
  phi_min: z.number().default(0),
  phi_max: z.number().default(6.283185307179586),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Surface_area_integralInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.radius * input.radius * (input.theta_max - input.theta_min) * (input.phi_max - input.phi_min); results["sphereArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sphereArea"] = Number.NaN; }
  try { const v = 2 * Math.PI * input.radius * input.height; results["cylinderLateralArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cylinderLateralArea"] = Number.NaN; }
  try { const v = ((input.shape === 0 ? (toNumericFormulaValue(results["sphereArea"])) : (toNumericFormulaValue(results["cylinderLateralArea"]))) ? 1 : 0); results["totalArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalArea"] = Number.NaN; }
  return results;
}


export function calculateSurface_area_integral(input: Surface_area_integralInput): Surface_area_integralOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalArea"]);
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


export interface Surface_area_integralOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
