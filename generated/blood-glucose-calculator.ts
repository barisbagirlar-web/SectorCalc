// Auto-generated from blood-glucose-calculator-schema.json
import * as z from 'zod';

export interface Blood_glucose_calculatorInput {
  mode: number;
  value1: number;
  unitFrom: number;
  unitTo: number;
  fasting: number;
  dataConfidence?: number;
}

export const Blood_glucose_calculatorInputSchema = z.object({
  mode: z.number().default(1),
  value1: z.number().default(100),
  unitFrom: z.number().default(1),
  unitTo: z.number().default(2),
  fasting: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Blood_glucose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mode===1 ? (input.unitFrom===1 ? (input.unitTo===2 ? input.value1/18.0182 : input.value1) : (input.unitTo===1 ? input.value1*18.0182 : input.value1)) : input.mode===2 ? 28.7*input.value1 - 46.7 : (input.value1 + 46.7)/28.7); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.mode===1 ? (input.unitFrom===1 ? (input.unitTo===2 ? input.value1/18.0182 : input.value1) : (input.unitTo===1 ? input.value1*18.0182 : input.value1)) : input.mode===2 ? 28.7*input.value1 - 46.7 : (input.value1 + 46.7)/28.7); results["result_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBlood_glucose_calculator(input: Blood_glucose_calculatorInput): Blood_glucose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Blood_glucose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
