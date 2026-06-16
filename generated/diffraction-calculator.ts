// Auto-generated from diffraction-calculator-schema.json
import * as z from 'zod';

export interface Diffraction_calculatorInput {
  wavelength: number;
  slitWidth: number;
  order: number;
  screenDistance: number;
}

export const Diffraction_calculatorInputSchema = z.object({
  wavelength: z.number().default(500),
  slitWidth: z.number().default(0.1),
  order: z.number().default(1),
  screenDistance: z.number().default(1),
});

function evaluateAllFormulas(input: Diffraction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.order * input.wavelength * 1e-9) / (input.slitWidth * 1e-3); results["sinTheta"] = Number.isFinite(v) ? v : 0; } catch { results["sinTheta"] = 0; }
  try { const v = ((input.order * input.wavelength * 1e-9) / (input.slitWidth * 1e-3)) / Math.sqrt(1 - ((input.order * input.wavelength * 1e-9) / (input.slitWidth * 1e-3))**2); results["tanTheta"] = Number.isFinite(v) ? v : 0; } catch { results["tanTheta"] = 0; }
  try { const v = input.screenDistance * (((input.order * input.wavelength * 1e-9) / (input.slitWidth * 1e-3)) / Math.sqrt(1 - ((input.order * input.wavelength * 1e-9) / (input.slitWidth * 1e-3))**2)); results["position"] = Number.isFinite(v) ? v : 0; } catch { results["position"] = 0; }
  return results;
}


export function calculateDiffraction_calculator(input: Diffraction_calculatorInput): Diffraction_calculatorOutput {
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


export interface Diffraction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
