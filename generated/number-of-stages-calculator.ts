// @ts-nocheck
// Auto-generated from number-of-stages-calculator-schema.json
import * as z from 'zod';

export interface Number_of_stages_calculatorInput {
  p_in: number;
  p_out: number;
  r_max: number;
  safety_factor: number;
}

export const Number_of_stages_calculatorInputSchema = z.object({
  p_in: z.number().default(1),
  p_out: z.number().default(10),
  r_max: z.number().default(3.5),
  safety_factor: z.number().default(1.1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Number_of_stages_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.p_out / input.p_in; results["overallPR"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overallPR"] = 0; }
  try { const v = input.p_out / input.p_in; results["overallPR_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overallPR_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNumber_of_stages_calculator(input: Number_of_stages_calculatorInput): Number_of_stages_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallPR_aux"]);
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


export interface Number_of_stages_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
