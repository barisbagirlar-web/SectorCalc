// Auto-generated from diabetic-calculator-schema.json
import * as z from 'zod';

export interface Diabetic_calculatorInput {
  carbs: number;
  currentBG: number;
  targetBG: number;
  insulinToCarbRatio: number;
  insulinSensitivity: number;
  dataConfidence?: number;
}

export const Diabetic_calculatorInputSchema = z.object({
  carbs: z.number().default(0),
  currentBG: z.number().default(120),
  targetBG: z.number().default(100),
  insulinToCarbRatio: z.number().default(15),
  insulinSensitivity: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Diabetic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.carbs / input.insulinToCarbRatio; results["carbInsulin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["carbInsulin"] = 0; }
  try { const v = (input.currentBG - input.targetBG) / input.insulinSensitivity; results["correctionInsulin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctionInsulin"] = 0; }
  try { const v = (asFormulaNumber(results["carbInsulin"])) + (asFormulaNumber(results["correctionInsulin"])); results["totalInsulin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInsulin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDiabetic_calculator(input: Diabetic_calculatorInput): Diabetic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalInsulin"]));
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


export interface Diabetic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
