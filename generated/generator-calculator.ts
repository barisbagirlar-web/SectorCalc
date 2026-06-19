// Auto-generated from generator-calculator-schema.json
import * as z from 'zod';

export interface Generator_calculatorInput {
  powerRating: number;
  loadFactor: number;
  operatingHours: number;
  fuelConsumptionRate: number;
  fuelDensity: number;
  generatorEfficiency: number;
  dataConfidence?: number;
}

export const Generator_calculatorInputSchema = z.object({
  powerRating: z.number().default(100),
  loadFactor: z.number().default(75),
  operatingHours: z.number().default(8),
  fuelConsumptionRate: z.number().default(0.3),
  fuelDensity: z.number().default(0.85),
  generatorEfficiency: z.number().default(95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerRating * (input.loadFactor / 100) * (input.generatorEfficiency / 100); results["actualPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["actualPower"] = 0; }
  try { const v = (asFormulaNumber(results["actualPower"])) * input.operatingHours; results["dailyEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyEnergy"] = 0; }
  try { const v = (asFormulaNumber(results["dailyEnergy"])) * input.fuelConsumptionRate; results["fuelVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelVolume"] = 0; }
  try { const v = (asFormulaNumber(results["fuelVolume"])) * input.fuelDensity; results["fuelMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelMass"] = 0; }
  try { const v = (asFormulaNumber(results["fuelMass"])) * 3.15; results["co2Emissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["co2Emissions"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGenerator_calculator(input: Generator_calculatorInput): Generator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["fuelVolume"]));
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


export interface Generator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
