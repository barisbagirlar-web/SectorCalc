// Auto-generated from body-composition-calculator-schema.json
import * as z from 'zod';

export interface Body_composition_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  waist: number;
  hip: number;
  neck: number;
  dataConfidence?: number;
}

export const Body_composition_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  waist: z.number().default(80),
  hip: z.number().default(90),
  neck: z.number().default(38),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Body_composition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.weight) * (input.height) * (input.age) * (input.gender) * (input.waist) * (input.hip) * (input.neck); results["bmi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmi"] = Number.NaN; }
  try { const v = (input.weight) * (input.height) * (input.age); results["bmi_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmi_aux"] = Number.NaN; }
  return results;
}


export function calculateBody_composition_calculator(input: Body_composition_calculatorInput): Body_composition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bmi"]);
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


export interface Body_composition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
