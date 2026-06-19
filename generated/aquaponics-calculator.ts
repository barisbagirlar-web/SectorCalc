// Auto-generated from aquaponics-calculator-schema.json
import * as z from 'zod';

export interface Aquaponics_calculatorInput {
  fishCount: number;
  fishWeight: number;
  feedRate: number;
  feedProtein: number;
  plantNitrogenUptake: number;
  fishDensity: number;
  dataConfidence?: number;
}

export const Aquaponics_calculatorInputSchema = z.object({
  fishCount: z.number().default(100),
  fishWeight: z.number().default(0.5),
  feedRate: z.number().default(2),
  feedProtein: z.number().default(35),
  plantNitrogenUptake: z.number().default(1.5),
  fishDensity: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Aquaponics_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fishCount * input.fishWeight * input.feedRate / 100; results["dailyFeed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyFeed"] = 0; }
  try { const v = (asFormulaNumber(results["dailyFeed"])) * input.feedProtein; results["tanProduction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tanProduction"] = 0; }
  try { const v = (asFormulaNumber(results["tanProduction"])) / input.plantNitrogenUptake; results["requiredPlantArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredPlantArea"] = 0; }
  try { const v = input.fishCount / input.fishDensity * 1000; results["fishTankVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fishTankVolume"] = 0; }
  try { const v = (asFormulaNumber(results["fishTankVolume"])) / 60; results["recirculationFlow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recirculationFlow"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAquaponics_calculator(input: Aquaponics_calculatorInput): Aquaponics_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["requiredPlantArea"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
