// Auto-generated from body-water-calculator-schema.json
import * as z from 'zod';

export interface Body_water_calculatorInput {
  sex: number;
  age: number;
  weight: number;
  height: number;
  dataConfidence?: number;
}

export const Body_water_calculatorInputSchema = z.object({
  sex: z.number().default(1),
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Body_water_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2.447 - (0.09156 * input.age) + (0.1074 * input.height) + (0.3362 * input.weight); results["tbwMale"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tbwMale"] = Number.NaN; }
  try { const v = -2.097 + (0.1069 * input.height) + (0.2466 * input.weight); results["tbwFemale"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tbwFemale"] = Number.NaN; }
  try { const v = ((input.sex === 1 ? (toNumericFormulaValue(results["tbwMale"])) : (toNumericFormulaValue(results["tbwFemale"]))) ? 1 : 0); results["totalBodyWater"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBodyWater"] = Number.NaN; }
  try { const v = ((((input.sex === 1 ? (toNumericFormulaValue(results["tbwMale"])) : (toNumericFormulaValue(results["tbwFemale"]))) / input.weight) * 100) ? 1 : 0); results["waterPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterPercentage"] = Number.NaN; }
  return results;
}


export function calculateBody_water_calculator(input: Body_water_calculatorInput): Body_water_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["waterPercentage"]);
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


export interface Body_water_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
