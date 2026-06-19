// Auto-generated from radiation-exposure-calculator-schema.json
import * as z from 'zod';

export interface Radiation_exposure_calculatorInput {
  sourceActivity: number;
  gammaConstant: number;
  distance: number;
  shieldThickness: number;
  hvl: number;
  conversionFactor: number;
  dataConfidence?: number;
}

export const Radiation_exposure_calculatorInputSchema = z.object({
  sourceActivity: z.number().default(1),
  gammaConstant: z.number().default(0.5),
  distance: z.number().default(1),
  shieldThickness: z.number().default(0),
  hvl: z.number().default(1),
  conversionFactor: z.number().default(8.77),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Radiation_exposure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sourceActivity * input.gammaConstant) / (input.distance ** 2); results["exposureRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exposureRate"] = 0; }
  try { const v = (input.sourceActivity * input.gammaConstant) / (input.distance ** 2); results["exposureRate_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exposureRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRadiation_exposure_calculator(input: Radiation_exposure_calculatorInput): Radiation_exposure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["exposureRate_aux"]));
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


export interface Radiation_exposure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
