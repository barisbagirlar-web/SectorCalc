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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Type_2_diabetes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age * 0.1; results["ageRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ageRisk"] = Number.NaN; }
  try { const v = input.bmi * 0.5; results["bmiRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmiRisk"] = Number.NaN; }
  try { const v = input.waist * 0.2; results["waistRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waistRisk"] = Number.NaN; }
  try { const v = input.fastingGlucose * 0.03; results["glucoseRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["glucoseRisk"] = Number.NaN; }
  try { const v = - input.hdl * 0.1; results["hdlRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hdlRisk"] = Number.NaN; }
  try { const v = input.systolicBP * 0.05; results["bpRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bpRisk"] = Number.NaN; }
  try { const v = input.age * 0.1 + input.bmi * 0.5 + input.waist * 0.2 + input.fastingGlucose * 0.03 - input.hdl * 0.1 + input.systolicBP * 0.05; results["totalRiskScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRiskScore"] = Number.NaN; }
  return results;
}


export function calculateType_2_diabetes_calculator(input: Type_2_diabetes_calculatorInput): Type_2_diabetes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRiskScore"]);
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


export interface Type_2_diabetes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
