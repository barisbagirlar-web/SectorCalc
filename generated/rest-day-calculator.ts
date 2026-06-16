// Auto-generated from rest-day-calculator-schema.json
import * as z from 'zod';

export interface Rest_day_calculatorInput {
  targetPercent: number;
  refStrength: number;
  tempCoeff: number;
  humidCoeff: number;
  safetyFactor: number;
}

export const Rest_day_calculatorInputSchema = z.object({
  targetPercent: z.number().default(70),
  refStrength: z.number().default(30),
  tempCoeff: z.number().default(1),
  humidCoeff: z.number().default(1),
  safetyFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Rest_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.safetyFactor * input.tempCoeff * input.humidCoeff * 28 * (input.targetPercent / 100) ** 2; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.refStrength * input.targetPercent / 100; results["requiredStrength"] = Number.isFinite(v) ? v : 0; } catch { results["requiredStrength"] = 0; }
  try { const v = input.refStrength * Math.sqrt((input.safetyFactor * input.tempCoeff * input.humidCoeff * 28 * (input.targetPercent / 100) ** 2) / 28); results["estimatedStrength"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedStrength"] = 0; }
  return results;
}


export function calculateRest_day_calculator(input: Rest_day_calculatorInput): Rest_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["restDays"] ?? 0;
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


export interface Rest_day_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
