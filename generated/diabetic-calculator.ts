// Auto-generated from diabetic-calculator-schema.json
import * as z from 'zod';

export interface Diabetic_calculatorInput {
  carbs: number;
  currentBG: number;
  targetBG: number;
  insulinToCarbRatio: number;
  insulinSensitivity: number;
}

export const Diabetic_calculatorInputSchema = z.object({
  carbs: z.number().default(0),
  currentBG: z.number().default(120),
  targetBG: z.number().default(100),
  insulinToCarbRatio: z.number().default(15),
  insulinSensitivity: z.number().default(50),
});

function evaluateAllFormulas(input: Diabetic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.carbs / input.insulinToCarbRatio; results["carbInsulin"] = Number.isFinite(v) ? v : 0; } catch { results["carbInsulin"] = 0; }
  try { const v = (input.currentBG - input.targetBG) / input.insulinSensitivity; results["correctionInsulin"] = Number.isFinite(v) ? v : 0; } catch { results["correctionInsulin"] = 0; }
  try { const v = (results["carbInsulin"] ?? 0) + (results["correctionInsulin"] ?? 0); results["totalInsulin"] = Number.isFinite(v) ? v : 0; } catch { results["totalInsulin"] = 0; }
  return results;
}


export function calculateDiabetic_calculator(input: Diabetic_calculatorInput): Diabetic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalInsulin"] ?? 0;
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


export interface Diabetic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
