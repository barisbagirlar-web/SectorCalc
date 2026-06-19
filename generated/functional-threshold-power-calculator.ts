// Auto-generated from functional-threshold-power-calculator-schema.json
import * as z from 'zod';

export interface Functional_threshold_power_calculatorInput {
  avgPower20min: number;
  weight: number;
  factor: number;
  testDuration: number;
  dataConfidence?: number;
}

export const Functional_threshold_power_calculatorInputSchema = z.object({
  avgPower20min: z.number().default(250),
  weight: z.number().default(70),
  factor: z.number().default(0.95),
  testDuration: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Functional_threshold_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avgPower20min * input.factor; results["ftp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ftp"] = 0; }
  try { const v = input.avgPower20min * input.factor / input.weight; results["powerToWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["powerToWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFunctional_threshold_power_calculator(input: Functional_threshold_power_calculatorInput): Functional_threshold_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ftp"]);
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


export interface Functional_threshold_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
