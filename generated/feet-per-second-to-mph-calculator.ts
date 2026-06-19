// Auto-generated from feet-per-second-to-mph-calculator-schema.json
import * as z from 'zod';

export interface Feet_per_second_to_mph_calculatorInput {
  feetPerSecond: number;
  precision: number;
  calibrationOffset: number;
  outputUnitScaling: number;
  dataConfidence?: number;
}

export const Feet_per_second_to_mph_calculatorInputSchema = z.object({
  feetPerSecond: z.number().default(1),
  precision: z.number().default(2),
  calibrationOffset: z.number().default(0),
  outputUnitScaling: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Feet_per_second_to_mph_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.feetPerSecond + input.calibrationOffset; results["adjustedSpeed___feetPerSecond___calibrat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedSpeed___feetPerSecond___calibrat"] = 0; }
  try { const v = input.feetPerSecond + input.calibrationOffset; results["adjustedSpeed___feetPerSecond___calibrat_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedSpeed___feetPerSecond___calibrat_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFeet_per_second_to_mph_calculator(input: Feet_per_second_to_mph_calculatorInput): Feet_per_second_to_mph_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedSpeed___feetPerSecond___calibrat_aux"]);
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


export interface Feet_per_second_to_mph_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
