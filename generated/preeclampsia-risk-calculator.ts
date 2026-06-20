// Auto-generated from preeclampsia-risk-calculator-schema.json
import * as z from 'zod';

export interface Preeclampsia_risk_calculatorInput {
  age: number;
  bmi: number;
  systolic_bp: number;
  diastolic_bp: number;
  previous_preeclampsia: number;
  family_history: number;
  dataConfidence?: number;
}

export const Preeclampsia_risk_calculatorInputSchema = z.object({
  age: z.number().default(30),
  bmi: z.number().default(25),
  systolic_bp: z.number().default(120),
  diastolic_bp: z.number().default(80),
  previous_preeclampsia: z.number().default(0),
  family_history: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Preeclampsia_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -10 + 0.03 * input.age + 0.05 * input.bmi + 0.02 * input.systolic_bp + 0.03 * input.diastolic_bp + 1.5 * input.previous_preeclampsia + 0.8 * input.family_history; results["linear_predictor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["linear_predictor"] = Number.NaN; }
  try { const v = 0.03 * input.age; results["age_contrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["age_contrib"] = Number.NaN; }
  try { const v = 0.05 * input.bmi; results["bmi_contrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmi_contrib"] = Number.NaN; }
  try { const v = 0.02 * input.systolic_bp; results["sbp_contrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sbp_contrib"] = Number.NaN; }
  try { const v = 0.03 * input.diastolic_bp; results["dbp_contrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dbp_contrib"] = Number.NaN; }
  try { const v = 1.5 * input.previous_preeclampsia; results["prev_contrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["prev_contrib"] = Number.NaN; }
  try { const v = 0.8 * input.family_history; results["fam_contrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fam_contrib"] = Number.NaN; }
  return results;
}


export function calculatePreeclampsia_risk_calculator(input: Preeclampsia_risk_calculatorInput): Preeclampsia_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fam_contrib"]);
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


export interface Preeclampsia_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
