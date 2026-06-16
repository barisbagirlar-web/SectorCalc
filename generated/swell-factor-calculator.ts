// Auto-generated from swell-factor-calculator-schema.json
import * as z from 'zod';

export interface Swell_factor_calculatorInput {
  bankVolume: number;
  swellFactorPercent: number;
  wasteFactorPercent: number;
  truckCapacity: number;
}

export const Swell_factor_calculatorInputSchema = z.object({
  bankVolume: z.number().default(100),
  swellFactorPercent: z.number().default(25),
  wasteFactorPercent: z.number().default(5),
  truckCapacity: z.number().default(10),
});

function evaluateAllFormulas(input: Swell_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bankVolume * (1 + input.swellFactorPercent/100) * (1 + input.wasteFactorPercent/100); results["totalLooseVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalLooseVolume"] = 0; }
  try { const v = input.swellFactorPercent / 100; results["swellRatio"] = Number.isFinite(v) ? v : 0; } catch { results["swellRatio"] = 0; }
  try { const v = input.bankVolume * (input.swellFactorPercent / 100); results["volumeIncrease"] = Number.isFinite(v) ? v : 0; } catch { results["volumeIncrease"] = 0; }
  try { const v = (input.bankVolume * (1 + input.swellFactorPercent/100) * (1 + input.wasteFactorPercent/100)) - input.bankVolume; results["adjustedVolumeIncrease"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedVolumeIncrease"] = 0; }
  try { const v = (input.bankVolume * (1 + input.swellFactorPercent/100) * (1 + input.wasteFactorPercent/100)) / input.truckCapacity; results["loadsRequired"] = Number.isFinite(v) ? v : 0; } catch { results["loadsRequired"] = 0; }
  return results;
}


export function calculateSwell_factor_calculator(input: Swell_factor_calculatorInput): Swell_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalLooseVolume"] ?? 0;
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


export interface Swell_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
