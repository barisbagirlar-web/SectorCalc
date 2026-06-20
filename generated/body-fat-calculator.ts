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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Body_fat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age * input.height * input.weight * input.neckCircumference; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.age * input.height * input.weight * input.neckCircumference * (input.waistCircumference * input.hipCircumference); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.waistCircumference * input.hipCircumference; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateBody_fat_calculator(input: Body_fat_calculatorInput): Body_fat_calculatorOutput {
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
