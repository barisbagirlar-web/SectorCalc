// Auto-generated from maintenance-calories-calculator-schema.json
import * as z from 'zod';

export interface Maintenance_calories_calculatorInput {
  gender: number;
  age: number;
  weight: number;
  height: number;
  activityLevel: number;
  dataConfidence?: number;
}

export const Maintenance_calories_calculatorInputSchema = z.object({
  gender: z.number().default(1),
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
  activityLevel: z.number().default(1.55),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Maintenance_calories_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 66*input.gender + 655*(1-input.gender) + (13.7*input.gender + 9.6*(1-input.gender))*input.weight + (5*input.gender + 1.8*(1-input.gender))*input.height - (6.8*input.gender + 4.7*(1-input.gender))*input.age; results["BMR"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["BMR"] = 0; }
  try { const v = 66*input.gender + 655*(1-input.gender) + (13.7*input.gender + 9.6*(1-input.gender))*input.weight + (5*input.gender + 1.8*(1-input.gender))*input.height - (6.8*input.gender + 4.7*(1-input.gender))*input.age; results["BMR_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["BMR_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMaintenance_calories_calculator(input: Maintenance_calories_calculatorInput): Maintenance_calories_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["BMR_aux"]));
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


export interface Maintenance_calories_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
