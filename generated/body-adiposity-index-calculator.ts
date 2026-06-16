// Auto-generated from body-adiposity-index-calculator-schema.json
import * as z from 'zod';

export interface Body_adiposity_index_calculatorInput {
  hipCm: number;
  heightCm: number;
  weightKg: number;
  neckCm: number;
  waistCm: number;
  gender: number;
  age: number;
}

export const Body_adiposity_index_calculatorInputSchema = z.object({
  hipCm: z.number().default(100),
  heightCm: z.number().default(170),
  weightKg: z.number().default(70),
  neckCm: z.number().default(38),
  waistCm: z.number().default(80),
  gender: z.number().default(0),
  age: z.number().default(30),
});

function evaluateAllFormulas(input: Body_adiposity_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hipCm / Math.pow(input.heightCm/100, 1.5)) - 18; results["bai"] = Number.isFinite(v) ? v : 0; } catch { results["bai"] = 0; }
  try { const v = input.weightKg / Math.pow(input.heightCm/100, 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = (1-input.gender)*(86.010*(Math.log(input.waistCm - input.neckCm)/Math.log(10)) - 70.041*(Math.log(input.heightCm)/Math.log(10)) + 36.76) + input.gender*(163.205*(Math.log(input.waistCm + input.hipCm - input.neckCm)/Math.log(10)) - 97.684*(Math.log(input.heightCm)/Math.log(10)) - 78.387); results["bodyFatNavy"] = Number.isFinite(v) ? v : 0; } catch { results["bodyFatNavy"] = 0; }
  return results;
}


export function calculateBody_adiposity_index_calculator(input: Body_adiposity_index_calculatorInput): Body_adiposity_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bai"] ?? 0;
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


export interface Body_adiposity_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
