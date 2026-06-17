// @ts-nocheck
// Auto-generated from reynolds-risk-score-calculator-schema.json
import * as z from 'zod';

export interface Reynolds_risk_score_calculatorInput {
  age: number;
  systolicBP: number;
  totalCholesterol: number;
  hdl: number;
  smoker: number;
  diabetic: number;
  gender: number;
}

export const Reynolds_risk_score_calculatorInputSchema = z.object({
  age: z.number().default(55),
  systolicBP: z.number().default(120),
  totalCholesterol: z.number().default(200),
  hdl: z.number().default(50),
  smoker: z.number().default(0),
  diabetic: z.number().default(0),
  gender: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reynolds_risk_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.age + input.systolicBP + input.totalCholesterol; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.age + input.systolicBP + input.totalCholesterol; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateReynolds_risk_score_calculator(input: Reynolds_risk_score_calculatorInput): Reynolds_risk_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Reynolds_risk_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
