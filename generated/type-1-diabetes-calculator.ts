// Auto-generated from type-1-diabetes-calculator-schema.json
import * as z from 'zod';

export interface Type_1_diabetes_calculatorInput {
  bloodGlucose: number;
  targetGlucose: number;
  insulinSensitivity: number;
  carbIntake: number;
  insulinCarbRatio: number;
  activeInsulin: number;
  dataConfidence?: number;
}

export const Type_1_diabetes_calculatorInputSchema = z.object({
  bloodGlucose: z.number().default(120),
  targetGlucose: z.number().default(100),
  insulinSensitivity: z.number().default(50),
  carbIntake: z.number().default(50),
  insulinCarbRatio: z.number().default(10),
  activeInsulin: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Type_1_diabetes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bloodGlucose - input.targetGlucose) / input.insulinSensitivity; results["correctionBolus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["correctionBolus"] = Number.NaN; }
  try { const v = input.carbIntake / input.insulinCarbRatio; results["carbBolus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbBolus"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["correctionBolus"])) + (toNumericFormulaValue(results["carbBolus"])) - input.activeInsulin; results["totalBolus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBolus"] = Number.NaN; }
  return results;
}


export function calculateType_1_diabetes_calculator(input: Type_1_diabetes_calculatorInput): Type_1_diabetes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBolus"]);
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


export interface Type_1_diabetes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
