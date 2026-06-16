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

function evaluateAllFormulas(input: Type_1_diabetes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, (input.bloodGlucose - input.targetGlucose) / input.insulinSensitivity); results["correctionBolus"] = Number.isFinite(v) ? v : 0; } catch { results["correctionBolus"] = 0; }
  try { const v = input.carbIntake / input.insulinCarbRatio; results["carbBolus"] = Number.isFinite(v) ? v : 0; } catch { results["carbBolus"] = 0; }
  try { const v = Math.max(0, (results["carbBolus"] ?? 0) + (results["correctionBolus"] ?? 0) - input.activeInsulin); results["totalBolus"] = Number.isFinite(v) ? v : 0; } catch { results["totalBolus"] = 0; }
  return results;
}


export function calculateType_1_diabetes_calculator(input: Type_1_diabetes_calculatorInput): Type_1_diabetes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBolus"] ?? 0;
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


export interface Type_1_diabetes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
