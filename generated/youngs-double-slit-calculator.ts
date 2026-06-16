// Auto-generated from youngs-double-slit-calculator-schema.json
import * as z from 'zod';

export interface Youngs_double_slit_calculatorInput {
  wavelength: number;
  slitSeparation: number;
  screenDistance: number;
  fringeOrder: number;
}

export const Youngs_double_slit_calculatorInputSchema = z.object({
  wavelength: z.number().default(5e-7),
  slitSeparation: z.number().default(0.001),
  screenDistance: z.number().default(1),
  fringeOrder: z.number().default(1),
});

function evaluateAllFormulas(input: Youngs_double_slit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fringeOrder * input.wavelength * input.screenDistance) / input.slitSeparation; results["position"] = Number.isFinite(v) ? v : 0; } catch { results["position"] = 0; }
  try { const v = (input.wavelength * input.screenDistance) / input.slitSeparation; results["fringeSpacing"] = Number.isFinite(v) ? v : 0; } catch { results["fringeSpacing"] = 0; }
  try { const v = Math.atan((input.fringeOrder * input.wavelength) / input.slitSeparation); results["angleRad"] = Number.isFinite(v) ? v : 0; } catch { results["angleRad"] = 0; }
  try { const v = (Math.atan((input.fringeOrder * input.wavelength) / input.slitSeparation)) * (180 / Math.PI); results["angleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["angleDeg"] = 0; }
  return results;
}


export function calculateYoungs_double_slit_calculator(input: Youngs_double_slit_calculatorInput): Youngs_double_slit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["position"] ?? 0;
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


export interface Youngs_double_slit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
