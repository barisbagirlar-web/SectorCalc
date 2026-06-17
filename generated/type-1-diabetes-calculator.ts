// @ts-nocheck
// Auto-generated from type-1-diabetes-calculator-schema.json
import * as z from 'zod';

export interface Type_1_diabetes_calculatorInput {
  bloodGlucose: number;
  targetGlucose: number;
  insulinSensitivity: number;
  carbIntake: number;
  insulinCarbRatio: number;
  activeInsulin: number;
}

export const Type_1_diabetes_calculatorInputSchema = z.object({
  bloodGlucose: z.number().default(120),
  targetGlucose: z.number().default(100),
  insulinSensitivity: z.number().default(50),
  carbIntake: z.number().default(50),
  insulinCarbRatio: z.number().default(10),
  activeInsulin: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Type_1_diabetes_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.carbIntake / input.insulinCarbRatio; results["carbBolus"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carbBolus"] = 0; }
  try { const v = input.carbIntake / input.insulinCarbRatio; results["carbBolus_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carbBolus_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateType_1_diabetes_calculator(input: Type_1_diabetes_calculatorInput): Type_1_diabetes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["carbBolus_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
