// Auto-generated from body-water-percentage-calculator-schema.json
import * as z from 'zod';

export interface Body_water_percentage_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  dataConfidence?: number;
}

export const Body_water_percentage_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Body_water_percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - input.gender) * (-2.097 + 0.1069 * input.height + 0.2466 * input.weight) + input.gender * (2.447 - 0.09156 * input.age + 0.1074 * input.height + 0.3362 * input.weight); results["totalBodyWater"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBodyWater"] = 0; }
  try { const v = (((1 - input.gender) * (-2.097 + 0.1069 * input.height + 0.2466 * input.weight) + input.gender * (2.447 - 0.09156 * input.age + 0.1074 * input.height + 0.3362 * input.weight)) / input.weight) * 100; results["bodyWaterPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bodyWaterPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBody_water_percentage_calculator(input: Body_water_percentage_calculatorInput): Body_water_percentage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bodyWaterPercentage"]);
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


export interface Body_water_percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
