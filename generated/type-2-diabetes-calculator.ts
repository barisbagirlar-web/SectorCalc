// Auto-generated from type-2-diabetes-calculator-schema.json
import * as z from 'zod';

export interface Type_2_diabetes_calculatorInput {
  age: number;
  bmi: number;
  waist: number;
  fastingGlucose: number;
  hdl: number;
  systolicBP: number;
  dataConfidence?: number;
}

export const Type_2_diabetes_calculatorInputSchema = z.object({
  age: z.number().default(45),
  bmi: z.number().default(25),
  waist: z.number().default(90),
  fastingGlucose: z.number().default(100),
  hdl: z.number().default(50),
  systolicBP: z.number().default(120),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Type_2_diabetes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age * 0.1; results["ageRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ageRisk"] = 0; }
  try { const v = input.bmi * 0.5; results["bmiRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bmiRisk"] = 0; }
  try { const v = input.waist * 0.2; results["waistRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waistRisk"] = 0; }
  try { const v = input.fastingGlucose * 0.03; results["glucoseRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["glucoseRisk"] = 0; }
  try { const v = - input.hdl * 0.1; results["hdlRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hdlRisk"] = 0; }
  try { const v = input.systolicBP * 0.05; results["bpRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bpRisk"] = 0; }
  try { const v = input.age * 0.1 + input.bmi * 0.5 + input.waist * 0.2 + input.fastingGlucose * 0.03 - input.hdl * 0.1 + input.systolicBP * 0.05; results["totalRiskScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRiskScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateType_2_diabetes_calculator(input: Type_2_diabetes_calculatorInput): Type_2_diabetes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalRiskScore"]));
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


export interface Type_2_diabetes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
