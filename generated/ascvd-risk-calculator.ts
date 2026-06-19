// Auto-generated from ascvd-risk-calculator-schema.json
import * as z from 'zod';

export interface Ascvd_risk_calculatorInput {
  age: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  systolicBP: number;
  treatedHypertension: number;
  diabetes: number;
  smoker: number;
  male: number;
  dataConfidence?: number;
}

export const Ascvd_risk_calculatorInputSchema = z.object({
  age: z.number().default(50),
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  systolicBP: z.number().default(120),
  treatedHypertension: z.number().default(0),
  diabetes: z.number().default(0),
  smoker: z.number().default(0),
  male: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ascvd_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (-5) + 0.05*input.age + 0.01*input.totalCholesterol - 0.02*input.hdlCholesterol + 0.01*input.systolicBP + 0.5*input.treatedHypertension + 0.5*input.diabetes + 0.5*input.smoker + 0.3*input.male; results["calcLogOdds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calcLogOdds"] = 0; }
  try { const v = (-5) + 0.05*input.age + 0.01*input.totalCholesterol - 0.02*input.hdlCholesterol + 0.01*input.systolicBP + 0.5*input.treatedHypertension + 0.5*input.diabetes + 0.5*input.smoker + 0.3*input.male; results["calcLogOdds_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calcLogOdds_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAscvd_risk_calculator(input: Ascvd_risk_calculatorInput): Ascvd_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["calcLogOdds_aux"]);
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


export interface Ascvd_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
