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

function evaluateAllFormulas(input: Reynolds_risk_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let lp = (age - 55) * 0.05 + (systolicBP - 120) * 0.01 + (totalCholesterol - 200) * 0.005 + (hdl - 50) * (-0.02) + smoker * 0.5 + diabetic * 0.3; let base = gender === 0 ? 0.9965 : 0.9984; return (1 - Math.pow(base, Math.exp(lp))) * 100; })(); results["riskPercent"] = Number.isFinite(v) ? v : 0; } catch { results["riskPercent"] = 0; }
  try { const v = (() => { let lp = (age - 55) * 0.05 + (systolicBP - 120) * 0.01 + (totalCholesterol - 200) * 0.005 + (hdl - 50) * (-0.02) + smoker * 0.5 + diabetic * 0.3; let base = gender === 0 ? 0.9965 : 0.9984; return (1 - Math.pow(base, Math.exp(lp))) * 100; })(); results["riskPercent_copy"] = Number.isFinite(v) ? v : 0; } catch { results["riskPercent_copy"] = 0; }
  return results;
}


export function calculateReynolds_risk_score_calculator(input: Reynolds_risk_score_calculatorInput): Reynolds_risk_score_calculatorOutput {
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


export interface Reynolds_risk_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
