// Auto-generated from pediatric-bmi-calculator-schema.json
import * as z from 'zod';

export interface Pediatric_bmi_calculatorInput {
  age: number;
  sex: number;
  weight: number;
  height: number;
  dataConfidence?: number;
}

export const Pediatric_bmi_calculatorInputSchema = z.object({
  age: z.number().default(24),
  sex: z.number().default(0),
  weight: z.number().default(15),
  height: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pediatric_bmi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight; results["weight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weight"] = 0; }
  try { const v = input.height; results["height"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["height"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePediatric_bmi_calculator(input: Pediatric_bmi_calculatorInput): Pediatric_bmi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["height"]);
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


export interface Pediatric_bmi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
