// Auto-generated from youngs-double-slit-calculator-schema.json
import * as z from 'zod';

export interface Youngs_double_slit_calculatorInput {
  wavelength: number;
  slitSeparation: number;
  screenDistance: number;
  fringeOrder: number;
  dataConfidence?: number;
}

export const Youngs_double_slit_calculatorInputSchema = z.object({
  wavelength: z.number().default(5e-7),
  slitSeparation: z.number().default(0.001),
  screenDistance: z.number().default(1),
  fringeOrder: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Youngs_double_slit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fringeOrder * input.wavelength * input.screenDistance) / input.slitSeparation; results["position"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["position"] = 0; }
  try { const v = (input.wavelength * input.screenDistance) / input.slitSeparation; results["fringeSpacing"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fringeSpacing"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateYoungs_double_slit_calculator(input: Youngs_double_slit_calculatorInput): Youngs_double_slit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["position"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
