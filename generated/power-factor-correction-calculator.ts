// Auto-generated from power-factor-correction-calculator-schema.json
import * as z from 'zod';

export interface Power_factor_correction_calculatorInput {
  realPower: number;
  existingPowerFactor: number;
  targetPowerFactor: number;
  tariff: number;
  hoursPerDay: number;
}

export const Power_factor_correction_calculatorInputSchema = z.object({
  realPower: z.number().default(100),
  existingPowerFactor: z.number().default(0.8),
  targetPowerFactor: z.number().default(0.95),
  tariff: z.number().default(0.8),
  hoursPerDay: z.number().default(24),
});

function evaluateAllFormulas(input: Power_factor_correction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.realPower * (Math.sqrt(1 - input.existingPowerFactor**2) / input.existingPowerFactor - Math.sqrt(1 - input.targetPowerFactor**2) / input.targetPowerFactor); results["requiredKVAR"] = Number.isFinite(v) ? v : 0; } catch { results["requiredKVAR"] = 0; }
  try { const v = input.realPower * Math.sqrt(1 - input.existingPowerFactor**2) / input.existingPowerFactor; results["currentReactivePower"] = Number.isFinite(v) ? v : 0; } catch { results["currentReactivePower"] = 0; }
  try { const v = input.realPower * Math.sqrt(1 - input.targetPowerFactor**2) / input.targetPowerFactor; results["targetReactivePower"] = Number.isFinite(v) ? v : 0; } catch { results["targetReactivePower"] = 0; }
  try { const v = (input.realPower / input.existingPowerFactor) - (input.realPower / input.targetPowerFactor); results["apparentPowerReduction"] = Number.isFinite(v) ? v : 0; } catch { results["apparentPowerReduction"] = 0; }
  return results;
}


export function calculatePower_factor_correction_calculator(input: Power_factor_correction_calculatorInput): Power_factor_correction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredKVAR"] ?? 0;
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


export interface Power_factor_correction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
