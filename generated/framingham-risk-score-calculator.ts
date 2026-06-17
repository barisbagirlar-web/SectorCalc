// @ts-nocheck
// Auto-generated from framingham-risk-score-calculator-schema.json
import * as z from 'zod';

export interface Framingham_risk_score_calculatorInput {
  age: number;
  systolicPressure: number;
  cholesterol: number;
  hdlCholesterol: number;
  smokingStatus: number;
  bloodPressureTreatment: number;
}

export const Framingham_risk_score_calculatorInputSchema = z.object({
  age: z.number().default(50),
  systolicPressure: z.number().default(120),
  cholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  smokingStatus: z.number().default(0),
  bloodPressureTreatment: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Framingham_risk_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 0.1 * input.age + 0.02 * input.systolicPressure + 0.01 * input.cholesterol - 0.02 * input.hdlCholesterol + 0.3 * input.smokingStatus + 0.2 * input.bloodPressureTreatment; results["points"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["points"] = 0; }
  try { const v = 0.1 * input.age + 0.02 * input.systolicPressure + 0.01 * input.cholesterol - 0.02 * input.hdlCholesterol + 0.3 * input.smokingStatus + 0.2 * input.bloodPressureTreatment; results["points_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["points_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFramingham_risk_score_calculator(input: Framingham_risk_score_calculatorInput): Framingham_risk_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["points_aux"]);
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


export interface Framingham_risk_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
