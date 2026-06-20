// Auto-generated from framingham-risk-score-calculator-schema.json
import * as z from 'zod';

export interface Framingham_risk_score_calculatorInput {
  age: number;
  systolicPressure: number;
  cholesterol: number;
  hdlCholesterol: number;
  smokingStatus: number;
  bloodPressureTreatment: number;
  dataConfidence?: number;
}

export const Framingham_risk_score_calculatorInputSchema = z.object({
  age: z.number().default(50),
  systolicPressure: z.number().default(120),
  cholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  smokingStatus: z.number().default(0),
  bloodPressureTreatment: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Framingham_risk_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.1 * input.age + 0.02 * input.systolicPressure + 0.01 * input.cholesterol - 0.02 * input.hdlCholesterol + 0.3 * input.smokingStatus + 0.2 * input.bloodPressureTreatment; results["points"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["points"] = Number.NaN; }
  try { const v = 0.1 * input.age + 0.02 * input.systolicPressure + 0.01 * input.cholesterol - 0.02 * input.hdlCholesterol + 0.3 * input.smokingStatus + 0.2 * input.bloodPressureTreatment; results["points_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["points_aux"] = Number.NaN; }
  return results;
}


export function calculateFramingham_risk_score_calculator(input: Framingham_risk_score_calculatorInput): Framingham_risk_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["points_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
