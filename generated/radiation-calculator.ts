// @ts-nocheck
// Auto-generated from radiation-calculator-schema.json
import * as z from 'zod';

export interface Radiation_calculatorInput {
  sourceActivity: number;
  distance: number;
  shieldingThickness: number;
  halfValueLayer: number;
  exposureTime: number;
  gammaConstant: number;
}

export const Radiation_calculatorInputSchema = z.object({
  sourceActivity: z.number().default(1),
  distance: z.number().default(1),
  shieldingThickness: z.number().default(0),
  halfValueLayer: z.number().default(0.5),
  exposureTime: z.number().default(1),
  gammaConstant: z.number().default(1.32),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Radiation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.gammaConstant * input.sourceActivity / (input.distance ** 2); results["unshieldedDoseRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["unshieldedDoseRate"] = 0; }
  try { const v = input.gammaConstant * input.sourceActivity / (input.distance ** 2); results["unshieldedDoseRate_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["unshieldedDoseRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRadiation_calculator(input: Radiation_calculatorInput): Radiation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["unshieldedDoseRate_aux"]);
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


export interface Radiation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
