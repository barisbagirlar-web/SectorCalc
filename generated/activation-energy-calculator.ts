// Auto-generated from activation-energy-calculator-schema.json
import * as z from 'zod';

export interface Activation_energy_calculatorInput {
  k1: number;
  T1: number;
  k2: number;
  T2: number;
  R: number;
  dataConfidence?: number;
}

export const Activation_energy_calculatorInputSchema = z.object({
  k1: z.number().default(0.001),
  T1: z.number().default(300),
  k2: z.number().default(0.01),
  T2: z.number().default(350),
  R: z.number().default(8.314),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Activation_energy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1/input.T1 - 1/input.T2; results["inverseTemperatureDifference"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["inverseTemperatureDifference"] = 0; }
  try { const v = 1/input.T1 - 1/input.T2; results["inverseTemperatureDifference_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["inverseTemperatureDifference_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateActivation_energy_calculator(input: Activation_energy_calculatorInput): Activation_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["inverseTemperatureDifference_aux"]));
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


export interface Activation_energy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
