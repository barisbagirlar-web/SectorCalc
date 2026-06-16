// Auto-generated from nicotine-calculator-schema.json
import * as z from 'zod';

export interface Nicotine_calculatorInput {
  targetNicotine: number;
  finalVolume: number;
  baseNicotine: number;
  baseVG: number;
  desiredVG: number;
}

export const Nicotine_calculatorInputSchema = z.object({
  targetNicotine: z.number().default(6),
  finalVolume: z.number().default(100),
  baseNicotine: z.number().default(100),
  baseVG: z.number().default(100),
  desiredVG: z.number().default(70),
});

function evaluateAllFormulas(input: Nicotine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.targetNicotine * input.finalVolume) / input.baseNicotine; results["requiredBaseVolume"] = Number.isFinite(v) ? v : 0; } catch { results["requiredBaseVolume"] = 0; }
  try { const v = (input.finalVolume * (100 - input.desiredVG) / 100) - (((input.targetNicotine * input.finalVolume) / input.baseNicotine) * (100 - input.baseVG) / 100); results["additionalPG"] = Number.isFinite(v) ? v : 0; } catch { results["additionalPG"] = 0; }
  try { const v = (input.finalVolume * input.desiredVG / 100) - (((input.targetNicotine * input.finalVolume) / input.baseNicotine) * input.baseVG / 100); results["additionalVG"] = Number.isFinite(v) ? v : 0; } catch { results["additionalVG"] = 0; }
  return results;
}


export function calculateNicotine_calculator(input: Nicotine_calculatorInput): Nicotine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredBaseVolume"] ?? 0;
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


export interface Nicotine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
