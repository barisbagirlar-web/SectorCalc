// Auto-generated from nihss-calculator-schema.json
import * as z from 'zod';

export interface Nihss_calculatorInput {
  consciousness: number;
  gaze: number;
  visual: number;
  facial: number;
  motor_arm: number;
  motor_leg: number;
  language: number;
}

export const Nihss_calculatorInputSchema = z.object({
  consciousness: z.number().default(0),
  gaze: z.number().default(0),
  visual: z.number().default(0),
  facial: z.number().default(0),
  motor_arm: z.number().default(0),
  motor_leg: z.number().default(0),
  language: z.number().default(0),
});

function evaluateAllFormulas(input: Nihss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.consciousness + input.gaze + input.visual + input.facial + input.motor_arm + input.motor_leg + input.language; results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


export function calculateNihss_calculator(input: Nihss_calculatorInput): Nihss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Nihss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
