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
  try { const v = input.age * input.systolicBP * input.totalCholesterol * input.hdl; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.age * input.systolicBP * input.totalCholesterol * input.hdl * (input.smoker * input.diabetic * input.gender); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.smoker * input.diabetic * input.gender; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
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
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
