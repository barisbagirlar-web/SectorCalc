// Auto-generated from body-fat-percentage-calculator-schema.json
import * as z from 'zod';

export interface Body_fat_percentage_calculatorInput {
  gender: number;
  height: number;
  weight: number;
  neck: number;
  waist: number;
  hip: number;
}

export const Body_fat_percentage_calculatorInputSchema = z.object({
  gender: z.number().default(0),
  height: z.number().default(170),
  weight: z.number().default(70),
  neck: z.number().default(38),
  waist: z.number().default(85),
  hip: z.number().default(90),
});

function evaluateAllFormulas(input: Body_fat_percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.gender === 0) ? (86.010 * Math.log(input.waist - input.neck) / Math.log(10) - 70.041 * Math.log(input.height) / Math.log(10) + 36.76) : (163.205 * Math.log(input.waist + input.hip - input.neck) / Math.log(10) - 97.684 * Math.log(input.height) / Math.log(10) - 78.387); results["bodyFatPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["bodyFatPercentage"] = 0; }
  try { const v = input.weight / Math.pow(input.height / 100, 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = ((results["bodyFatPercentage"] ?? 0) / 100) * input.weight; results["fatMass"] = Number.isFinite(v) ? v : 0; } catch { results["fatMass"] = 0; }
  return results;
}


export function calculateBody_fat_percentage_calculator(input: Body_fat_percentage_calculatorInput): Body_fat_percentage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bodyFatPercentage"] ?? 0;
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


export interface Body_fat_percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
