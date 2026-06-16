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

function evaluateAllFormulas(input: Stroke_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1/(1+Math.exp(-(0.05*input.age+0.01*input.systolicBP+0.5*input.diabetes+0.8*input.currentSmoker+0.7*input.atrialFibrillation+0.6*input.leftVentricularHypertrophy-0.2*input.antihypertensiveMed-5))))*100; results["riskPercent"] = Number.isFinite(v) ? v : 0; } catch { results["riskPercent"] = 0; }
  try { const v = 0.05*input.age+0.01*input.systolicBP+0.5*input.diabetes+0.8*input.currentSmoker+0.7*input.atrialFibrillation+0.6*input.leftVentricularHypertrophy-0.2*input.antihypertensiveMed; results["riskScore"] = Number.isFinite(v) ? v : 0; } catch { results["riskScore"] = 0; }
  try { const v = ((1/(1+Math.exp(-(0.05*input.age+0.01*input.systolicBP+0.5*input.diabetes+0.8*input.currentSmoker+0.7*input.atrialFibrillation+0.6*input.leftVentricularHypertrophy-0.2*input.antihypertensiveMed-5))))*100) < 10 ? 0 : (((1/(1+Math.exp(-(0.05*input.age+0.01*input.systolicBP+0.5*input.diabetes+0.8*input.currentSmoker+0.7*input.atrialFibrillation+0.6*input.leftVentricularHypertrophy-0.2*input.antihypertensiveMed-5))))*100) < 20 ? 1 : 2); results["riskCategory"] = Number.isFinite(v) ? v : 0; } catch { results["riskCategory"] = 0; }
  return results;
}


export function calculateStroke_risk_calculator(input: Stroke_risk_calculatorInput): Stroke_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["riskPercent"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
