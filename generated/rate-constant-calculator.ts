// Auto-generated from rate-constant-calculator-schema.json
import * as z from 'zod';

export interface Rate_constant_calculatorInput {
  preExponentialFactor: number;
  activationEnergy: number;
  temperature: number;
  gasConstant: number;
  dataConfidence?: number;
}

export const Rate_constant_calculatorInputSchema = z.object({
  preExponentialFactor: z.number().default(10000000000000),
  activationEnergy: z.number().default(100000),
  temperature: z.number().default(298.15),
  gasConstant: z.number().default(8.314),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rate_constant_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -input.activationEnergy / (input.gasConstant * input.temperature); results["exponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exponent"] = Number.NaN; }
  try { const v = -input.activationEnergy / (input.gasConstant * input.temperature); results["exponent_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exponent_aux"] = Number.NaN; }
  return results;
}


export function calculateRate_constant_calculator(input: Rate_constant_calculatorInput): Rate_constant_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["exponent_aux"]);
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


export interface Rate_constant_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
