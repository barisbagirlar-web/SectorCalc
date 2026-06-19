// Auto-generated from boiler-horsepower-to-kw-calculator-schema.json
import * as z from 'zod';

export interface Boiler_horsepower_to_kw_calculatorInput {
  boilerHorsepower: number;
  numberOfBoilers: number;
  loadFactor: number;
  boilerEfficiency: number;
  operatingHours: number;
  conversionFactor: number;
  dataConfidence?: number;
}

export const Boiler_horsepower_to_kw_calculatorInputSchema = z.object({
  boilerHorsepower: z.number().default(1),
  numberOfBoilers: z.number().default(1),
  loadFactor: z.number().default(100),
  boilerEfficiency: z.number().default(80),
  operatingHours: z.number().default(8000),
  conversionFactor: z.number().default(9.8095),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Boiler_horsepower_to_kw_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.boilerHorsepower * input.numberOfBoilers * (input.loadFactor / 100); results["totalBHP"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBHP"] = 0; }
  try { const v = (asFormulaNumber(results["totalBHP"])) * input.conversionFactor; results["effectiveThermalPower_kW"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveThermalPower_kW"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveThermalPower_kW"])) * input.operatingHours; results["annualEnergy_kWh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualEnergy_kWh"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveThermalPower_kW"])) / (input.boilerEfficiency / 100); results["inputFuelPower_kW"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["inputFuelPower_kW"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBoiler_horsepower_to_kw_calculator(input: Boiler_horsepower_to_kw_calculatorInput): Boiler_horsepower_to_kw_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveThermalPower_kW"]);
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


export interface Boiler_horsepower_to_kw_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
