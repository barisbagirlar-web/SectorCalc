// Auto-generated from aperture-calculator-schema.json
import * as z from 'zod';

export interface Aperture_calculatorInput {
  focalLength: number;
  fNumber: number;
  transmissionPercent: number;
  wavelength: number;
  dataConfidence?: number;
}

export const Aperture_calculatorInputSchema = z.object({
  focalLength: z.number().default(50),
  fNumber: z.number().default(2.8),
  transmissionPercent: z.number().default(100),
  wavelength: z.number().default(550),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Aperture_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.focalLength / input.fNumber; results["apertureDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["apertureDiameter"] = 0; }
  try { const v = 1.22 * (input.wavelength * 1e-6) * input.fNumber; results["airyDiskRadius"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["airyDiskRadius"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAperture_calculator(input: Aperture_calculatorInput): Aperture_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["airyDiskRadius"]);
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


export interface Aperture_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
