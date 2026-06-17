// @ts-nocheck
// Auto-generated from body-fat-calculator-schema.json
import * as z from 'zod';

export interface Body_fat_calculatorInput {
  gender: string;
  age: number;
  height: number;
  weight: number;
  neckCircumference: number;
  waistCircumference: number;
  hipCircumference: number;
  activityLevel: string;
}

export const Body_fat_calculatorInputSchema = z.object({
  gender: z.enum(['male', 'female']).default('male'),
  age: z.number().min(18).max(100).default(30),
  height: z.number().min(100).max(250).default(170),
  weight: z.number().min(30).max(300).default(75),
  neckCircumference: z.number().min(25).max(60).default(38),
  waistCircumference: z.number().min(50).max(150).default(85),
  hipCircumference: z.number().min(50).max(160).default(95),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very active']).default('moderate'),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Body_fat_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.gender + input.age + input.height; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.gender + input.age + input.height; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBody_fat_calculator(input: Body_fat_calculatorInput): Body_fat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-user benchmarking","Custom report templates"],
  };
}


export interface Body_fat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
