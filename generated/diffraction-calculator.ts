// Auto-generated from diffraction-calculator-schema.json
import * as z from 'zod';

export interface Diffraction_calculatorInput {
  wavelength: number;
  slitWidth: number;
  order: number;
  screenDistance: number;
  dataConfidence?: number;
}

export const Diffraction_calculatorInputSchema = z.object({
  wavelength: z.number().default(500),
  slitWidth: z.number().default(0.1),
  order: z.number().default(1),
  screenDistance: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Diffraction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.order * input.wavelength * 1e-9) / (input.slitWidth * 1e-3); results["sinTheta"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sinTheta"] = Number.NaN; }
  try { const v = (input.order * input.wavelength * 1e-9) / (input.slitWidth * 1e-3); results["sinTheta_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sinTheta_aux"] = Number.NaN; }
  return results;
}


export function calculateDiffraction_calculator(input: Diffraction_calculatorInput): Diffraction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sinTheta"]);
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


export interface Diffraction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
