// @ts-nocheck
// Auto-generated from radiation-exposure-calculator-schema.json
import * as z from 'zod';

export interface Radiation_exposure_calculatorInput {
  sourceActivity: number;
  gammaConstant: number;
  distance: number;
  shieldThickness: number;
  hvl: number;
  conversionFactor: number;
}

export const Radiation_exposure_calculatorInputSchema = z.object({
  sourceActivity: z.number().default(1),
  gammaConstant: z.number().default(0.5),
  distance: z.number().default(1),
  shieldThickness: z.number().default(0),
  hvl: z.number().default(1),
  conversionFactor: z.number().default(8.77),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Radiation_exposure_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.sourceActivity * input.gammaConstant) / (input.distance ** 2); results["exposureRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exposureRate"] = 0; }
  try { const v = (input.sourceActivity * input.gammaConstant) / (input.distance ** 2); results["exposureRate_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exposureRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRadiation_exposure_calculator(input: Radiation_exposure_calculatorInput): Radiation_exposure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["exposureRate_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
