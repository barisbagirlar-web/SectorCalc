// Auto-generated from correction-factor-calculator-schema.json
import * as z from 'zod';

export interface Correction_factor_calculatorInput {
  measuredVolume: number;
  measuredTemperature: number;
  measuredPressure: number;
  standardTemperature: number;
  standardPressure: number;
  compressibilityFactor: number;
  dataConfidence?: number;
}

export const Correction_factor_calculatorInputSchema = z.object({
  measuredVolume: z.number().default(1000),
  measuredTemperature: z.number().default(20),
  measuredPressure: z.number().default(1.01325),
  standardTemperature: z.number().default(0),
  standardPressure: z.number().default(1.01325),
  compressibilityFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Correction_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.measuredPressure * (input.standardTemperature + 273.15)) / (input.standardPressure * (input.measuredTemperature + 273.15) * input.compressibilityFactor); results["correctionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctionFactor"] = 0; }
  try { const v = input.measuredVolume * (asFormulaNumber(results["correctionFactor"])); results["correctedVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctedVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCorrection_factor_calculator(input: Correction_factor_calculatorInput): Correction_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["correctionFactor"]));
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


export interface Correction_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
