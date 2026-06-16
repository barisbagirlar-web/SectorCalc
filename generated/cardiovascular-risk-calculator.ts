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

function evaluateAllFormulas(input: Cardiovascular_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender == 1 ? (-4.376 + 0.048 * input.age + 0.001 * input.totalCholesterol - 0.0007 * input.hdl + 0.013 * input.systolicBP + 0.55 * input.smoking + 0.85 * input.diabetes) : (-4.376 + 0.034 * input.age + 0.001 * input.totalCholesterol - 0.0007 * input.hdl + 0.013 * input.systolicBP + 0.55 * input.smoking + 0.85 * input.diabetes); results["logit"] = Number.isFinite(v) ? v : 0; } catch { results["logit"] = 0; }
  try { const v = 1 / (1 + Math.exp(-(results["logit"] ?? 0))); results["riskProbability"] = Number.isFinite(v) ? v : 0; } catch { results["riskProbability"] = 0; }
  try { const v = (results["riskProbability"] ?? 0) < 0.1 ? 'Düşük' : ((results["riskProbability"] ?? 0) < 0.2 ? 'Orta' : 'Yüksek'); results["riskCategory"] = Number.isFinite(v) ? v : 0; } catch { results["riskCategory"] = 0; }
  return results;
}


export function calculateCardiovascular_risk_calculator(input: Cardiovascular_risk_calculatorInput): Cardiovascular_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["riskProbability"] ?? 0;
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


export interface Cardiovascular_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
