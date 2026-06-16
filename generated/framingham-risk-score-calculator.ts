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

function evaluateAllFormulas(input: Framingham_risk_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.1 * input.age + 0.02 * input.systolicPressure + 0.01 * input.cholesterol - 0.02 * input.hdlCholesterol + 0.3 * input.smokingStatus + 0.2 * input.bloodPressureTreatment; results["points"] = Number.isFinite(v) ? v : 0; } catch { results["points"] = 0; }
  try { const v = Math.round((1 - 0.95 ** Math.exp((results["points"] ?? 0) - 20)) * 100 * 100) / 100; results["risk"] = Number.isFinite(v) ? v : 0; } catch { results["risk"] = 0; }
  return results;
}


export function calculateFramingham_risk_score_calculator(input: Framingham_risk_score_calculatorInput): Framingham_risk_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["risk"] ?? 0;
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


export interface Framingham_risk_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
