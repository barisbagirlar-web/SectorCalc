// Auto-generated from critical-angle-calculator-schema.json
import * as z from 'zod';

export interface Critical_angle_calculatorInput {
  n1: number;
  n2: number;
  outputUnit: number;
  precision: number;
  dataConfidence?: number;
}

export const Critical_angle_calculatorInputSchema = z.object({
  n1: z.number().default(1.5),
  n2: z.number().default(1),
  outputUnit: z.number().default(0),
  precision: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Critical_angle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.n2 / input.n1; results["ratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ratio"] = 0; }
  try { const v = input.n2 / input.n1; results["ratio_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ratio_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCritical_angle_calculator(input: Critical_angle_calculatorInput): Critical_angle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["ratio_aux"]));
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


export interface Critical_angle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
