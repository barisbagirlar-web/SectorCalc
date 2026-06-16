// Auto-generated from aperture-calculator-schema.json
import * as z from 'zod';

export interface Aperture_calculatorInput {
  focalLength: number;
  fNumber: number;
  transmissionPercent: number;
  wavelength: number;
}

export const Aperture_calculatorInputSchema = z.object({
  focalLength: z.number().default(50),
  fNumber: z.number().default(2.8),
  transmissionPercent: z.number().default(100),
  wavelength: z.number().default(550),
});

function evaluateAllFormulas(input: Aperture_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.focalLength / input.fNumber; results["apertureDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["apertureDiameter"] = 0; }
  try { const v = Math.PI * Math.pow(input.focalLength / input.fNumber / 2, 2); results["apertureArea"] = Number.isFinite(v) ? v : 0; } catch { results["apertureArea"] = 0; }
  try { const v = input.fNumber / Math.sqrt(input.transmissionPercent / 100); results["tStop"] = Number.isFinite(v) ? v : 0; } catch { results["tStop"] = 0; }
  try { const v = 1.22 * (input.wavelength * 1e-6) * input.fNumber; results["airyDiskRadius"] = Number.isFinite(v) ? v : 0; } catch { results["airyDiskRadius"] = 0; }
  return results;
}


export function calculateAperture_calculator(input: Aperture_calculatorInput): Aperture_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tStop"] ?? 0;
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


export interface Aperture_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
