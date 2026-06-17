// @ts-nocheck
// Auto-generated from cardiovascular-risk-calculator-schema.json
import * as z from 'zod';

export interface Cardiovascular_risk_calculatorInput {
  age: number;
  gender: number;
  totalCholesterol: number;
  hdl: number;
  systolicBP: number;
  smoking: number;
  diabetes: number;
}

export const Cardiovascular_risk_calculatorInputSchema = z.object({
  age: z.number().default(50),
  gender: z.number().default(1),
  totalCholesterol: z.number().default(200),
  hdl: z.number().default(50),
  systolicBP: z.number().default(120),
  smoking: z.number().default(0),
  diabetes: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cardiovascular_risk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.gender == 1 ? (-4.376 + 0.048 * input.age + 0.001 * input.totalCholesterol - 0.0007 * input.hdl + 0.013 * input.systolicBP + 0.55 * input.smoking + 0.85 * input.diabetes) : (-4.376 + 0.034 * input.age + 0.001 * input.totalCholesterol - 0.0007 * input.hdl + 0.013 * input.systolicBP + 0.55 * input.smoking + 0.85 * input.diabetes); results["logit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["logit"] = 0; }
  try { const v = input.gender == 1 ? (-4.376 + 0.048 * input.age + 0.001 * input.totalCholesterol - 0.0007 * input.hdl + 0.013 * input.systolicBP + 0.55 * input.smoking + 0.85 * input.diabetes) : (-4.376 + 0.034 * input.age + 0.001 * input.totalCholesterol - 0.0007 * input.hdl + 0.013 * input.systolicBP + 0.55 * input.smoking + 0.85 * input.diabetes); results["logit_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["logit_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCardiovascular_risk_calculator(input: Cardiovascular_risk_calculatorInput): Cardiovascular_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["logit_aux"]);
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


export interface Cardiovascular_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
