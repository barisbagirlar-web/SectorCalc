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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerRating * (input.loadFactor / 100) * (input.generatorEfficiency / 100); results["actualPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualPower"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["actualPower"])) * input.operatingHours; results["dailyEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyEnergy"])) * input.fuelConsumptionRate; results["fuelVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fuelVolume"])) * input.fuelDensity; results["fuelMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fuelMass"])) * 3.15; results["co2Emissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["co2Emissions"] = Number.NaN; }
  return results;
}


export function calculateGenerator_calculator(input: Generator_calculatorInput): Generator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fuelVolume"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
