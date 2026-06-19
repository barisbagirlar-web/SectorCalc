// Auto-generated from expected-value-calculator-schema.json
import * as z from 'zod';

export interface Expected_value_calculatorInput {
  outcome1_probability: number;
  outcome1_value: number;
  outcome2_probability: number;
  outcome2_value: number;
  outcome3_probability: number;
  outcome3_value: number;
  outcome4_probability: number;
  outcome4_value: number;
  dataConfidence?: number;
}

export const Expected_value_calculatorInputSchema = z.object({
  outcome1_probability: z.number().default(0.25),
  outcome1_value: z.number().default(100),
  outcome2_probability: z.number().default(0.25),
  outcome2_value: z.number().default(200),
  outcome3_probability: z.number().default(0.25),
  outcome3_value: z.number().default(300),
  outcome4_probability: z.number().default(0.25),
  outcome4_value: z.number().default(400),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Expected_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.outcome1_probability * input.outcome1_value) + (input.outcome2_probability * input.outcome2_value) + (input.outcome3_probability * input.outcome3_value) + (input.outcome4_probability * input.outcome4_value); results["EV"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["EV"] = 0; }
  try { const v = input.outcome1_probability * input.outcome1_value; results["Outcome1_Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Outcome1_Contribution"] = 0; }
  try { const v = input.outcome2_probability * input.outcome2_value; results["Outcome2_Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Outcome2_Contribution"] = 0; }
  try { const v = input.outcome3_probability * input.outcome3_value; results["Outcome3_Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Outcome3_Contribution"] = 0; }
  try { const v = input.outcome4_probability * input.outcome4_value; results["Outcome4_Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Outcome4_Contribution"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateExpected_value_calculator(input: Expected_value_calculatorInput): Expected_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["EV"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Expected_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
