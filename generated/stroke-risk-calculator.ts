// @ts-nocheck
// Auto-generated from stroke-risk-calculator-schema.json
import * as z from 'zod';

export interface Stroke_risk_calculatorInput {
  age: number;
  systolicBP: number;
  diabetes: number;
  currentSmoker: number;
  atrialFibrillation: number;
  leftVentricularHypertrophy: number;
  antihypertensiveMed: number;
}

export const Stroke_risk_calculatorInputSchema = z.object({
  age: z.number().default(60),
  systolicBP: z.number().default(130),
  diabetes: z.number().default(0),
  currentSmoker: z.number().default(0),
  atrialFibrillation: z.number().default(0),
  leftVentricularHypertrophy: z.number().default(0),
  antihypertensiveMed: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stroke_risk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 0.05*input.age+0.01*input.systolicBP+0.5*input.diabetes+0.8*input.currentSmoker+0.7*input.atrialFibrillation+0.6*input.leftVentricularHypertrophy-0.2*input.antihypertensiveMed; results["riskScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["riskScore"] = 0; }
  try { const v = 0.05*input.age+0.01*input.systolicBP+0.5*input.diabetes+0.8*input.currentSmoker+0.7*input.atrialFibrillation+0.6*input.leftVentricularHypertrophy-0.2*input.antihypertensiveMed; results["riskScore_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["riskScore_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStroke_risk_calculator(input: Stroke_risk_calculatorInput): Stroke_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["riskScore_aux"]);
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


export interface Stroke_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
