// Auto-generated from capacity-factor-calculator-schema.json
import * as z from 'zod';

export interface Capacity_factor_calculatorInput {
  actualEnergy: number;
  installedCapacity: number;
  hoursPeriod: number;
  availabilityFactor: number;
  targetCapacityFactor: number;
}

export const Capacity_factor_calculatorInputSchema = z.object({
  actualEnergy: z.number().default(0),
  installedCapacity: z.number().default(0),
  hoursPeriod: z.number().default(8760),
  availabilityFactor: z.number().default(1),
  targetCapacityFactor: z.number().default(50),
});

function evaluateAllFormulas(input: Capacity_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.installedCapacity * input.hoursPeriod * input.availabilityFactor; results["maxPossibleEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["maxPossibleEnergy"] = 0; }
  try { const v = (input.actualEnergy / (input.installedCapacity * input.hoursPeriod * input.availabilityFactor)) * 100; results["capacityFactor"] = Number.isFinite(v) ? v : 0; } catch { results["capacityFactor"] = 0; }
  try { const v = ((input.actualEnergy / (input.installedCapacity * input.hoursPeriod * input.availabilityFactor)) * 100) - input.targetCapacityFactor; results["deviation"] = Number.isFinite(v) ? v : 0; } catch { results["deviation"] = 0; }
  return results;
}


export function calculateCapacity_factor_calculator(input: Capacity_factor_calculatorInput): Capacity_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["capacityFactor"] ?? 0;
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


export interface Capacity_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
