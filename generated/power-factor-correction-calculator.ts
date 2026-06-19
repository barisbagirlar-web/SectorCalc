// Auto-generated from power-factor-correction-calculator-schema.json
import * as z from 'zod';

export interface Power_factor_correction_calculatorInput {
  realPower: number;
  existingPowerFactor: number;
  targetPowerFactor: number;
  tariff: number;
  hoursPerDay: number;
  dataConfidence?: number;
}

export const Power_factor_correction_calculatorInputSchema = z.object({
  realPower: z.number().default(100),
  existingPowerFactor: z.number().default(0.8),
  targetPowerFactor: z.number().default(0.95),
  tariff: z.number().default(0.8),
  hoursPerDay: z.number().default(24),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Power_factor_correction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.realPower / input.existingPowerFactor) - (input.realPower / input.targetPowerFactor); results["apparentPowerReduction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["apparentPowerReduction"] = 0; }
  try { const v = (input.realPower / input.existingPowerFactor) - (input.realPower / input.targetPowerFactor); results["apparentPowerReduction_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["apparentPowerReduction_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePower_factor_correction_calculator(input: Power_factor_correction_calculatorInput): Power_factor_correction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["apparentPowerReduction_aux"]));
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


export interface Power_factor_correction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
