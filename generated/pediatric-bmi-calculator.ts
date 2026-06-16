// Auto-generated from pediatric-bmi-calculator-schema.json
import * as z from 'zod';

export interface Pediatric_bmi_calculatorInput {
  age: number;
  sex: number;
  weight: number;
  height: number;
}

export const Pediatric_bmi_calculatorInputSchema = z.object({
  age: z.number().default(24),
  sex: z.number().default(0),
  weight: z.number().default(15),
  height: z.number().default(100),
});

function evaluateAllFormulas(input: Pediatric_bmi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight / Math.pow(input.height/100, 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  return results;
}


export function calculatePediatric_bmi_calculator(input: Pediatric_bmi_calculatorInput): Pediatric_bmi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bmi"] ?? 0;
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


export interface Pediatric_bmi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
