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

function evaluateAllFormulas(input: Body_composition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.gender === 1) ? (86.010 * Math.log(input.waist - input.neck)/Math.LN10 - 70.041 * Math.log(input.height)/Math.LN10 + 36.76) : (163.205 * Math.log(input.waist + input.hip - input.neck)/Math.LN10 - 97.684 * Math.log(input.height)/Math.LN10 - 78.387)); results["bodyFatPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["bodyFatPercentage"] = 0; }
  try { const v = input.weight / ((input.height/100) ** 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = input.weight * (1 - (((input.gender === 1) ? (86.010 * Math.log(input.waist - input.neck)/Math.LN10 - 70.041 * Math.log(input.height)/Math.LN10 + 36.76) : (163.205 * Math.log(input.waist + input.hip - input.neck)/Math.LN10 - 97.684 * Math.log(input.height)/Math.LN10 - 78.387)) / 100)); results["leanBodyMass"] = Number.isFinite(v) ? v : 0; } catch { results["leanBodyMass"] = 0; }
  try { const v = input.weight * (((input.gender === 1) ? (86.010 * Math.log(input.waist - input.neck)/Math.LN10 - 70.041 * Math.log(input.height)/Math.LN10 + 36.76) : (163.205 * Math.log(input.waist + input.hip - input.neck)/Math.LN10 - 97.684 * Math.log(input.height)/Math.LN10 - 78.387)) / 100); results["fatMass"] = Number.isFinite(v) ? v : 0; } catch { results["fatMass"] = 0; }
  return results;
}


export function calculateBody_composition_calculator(input: Body_composition_calculatorInput): Body_composition_calculatorOutput {
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


export interface Body_composition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
