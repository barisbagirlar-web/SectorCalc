// Auto-generated from calorie-deficit-calculator-schema.json
import * as z from 'zod';

export interface Calorie_deficit_calculatorInput {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  goalRate: string;
  bodyFatPercent: number;
  isPregnant: boolean;
  dataConfidence?: number;
}

export const Calorie_deficit_calculatorInputSchema = z.object({
  age: z.number().min(10).max(120).default(30),
  gender: z.enum(['male', 'female']).default('male'),
  weight: z.number().min(20).max(500).default(70),
  height: z.number().min(50).max(300).default(170),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very active']).default('moderate'),
  goalRate: z.enum(['slow', 'moderate', 'aggressive']).default('moderate'),
  bodyFatPercent: z.number().min(3).max(70).default(20),
  isPregnant: z.boolean().default(false),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Calorie_deficit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age * input.weight * input.height * (input.bodyFatPercent / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.age * input.weight * input.height * (input.bodyFatPercent / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCalorie_deficit_calculator(input: Calorie_deficit_calculatorInput): Calorie_deficit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Calorie_deficit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
