// Auto-generated from aquaponics-calculator-schema.json
import * as z from 'zod';

export interface Aquaponics_calculatorInput {
  fishCount: number;
  fishWeight: number;
  feedRate: number;
  feedProtein: number;
  plantNitrogenUptake: number;
  fishDensity: number;
}

export const Aquaponics_calculatorInputSchema = z.object({
  fishCount: z.number().default(100),
  fishWeight: z.number().default(0.5),
  feedRate: z.number().default(2),
  feedProtein: z.number().default(35),
  plantNitrogenUptake: z.number().default(1.5),
  fishDensity: z.number().default(30),
});

function evaluateAllFormulas(input: Aquaponics_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fishCount * input.fishWeight * input.feedRate / 100; results["dailyFeed"] = Number.isFinite(v) ? v : 0; } catch { results["dailyFeed"] = 0; }
  try { const v = (results["dailyFeed"] ?? 0) * input.feedProtein; results["tanProduction"] = Number.isFinite(v) ? v : 0; } catch { results["tanProduction"] = 0; }
  try { const v = (results["tanProduction"] ?? 0) / input.plantNitrogenUptake; results["requiredPlantArea"] = Number.isFinite(v) ? v : 0; } catch { results["requiredPlantArea"] = 0; }
  try { const v = input.fishCount / input.fishDensity * 1000; results["fishTankVolume"] = Number.isFinite(v) ? v : 0; } catch { results["fishTankVolume"] = 0; }
  try { const v = (results["fishTankVolume"] ?? 0) / 60; results["recirculationFlow"] = Number.isFinite(v) ? v : 0; } catch { results["recirculationFlow"] = 0; }
  return results;
}


export function calculateAquaponics_calculator(input: Aquaponics_calculatorInput): Aquaponics_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredPlantArea"] ?? 0;
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


export interface Aquaponics_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
