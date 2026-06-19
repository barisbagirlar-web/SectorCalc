// Auto-generated from passive-earth-pressure-calculator-schema.json
import * as z from 'zod';

export interface Passive_earth_pressure_calculatorInput {
  soilUnitWeight: number;
  heightOfWall: number;
  frictionAngle: number;
  cohesion: number;
  surcharge: number;
  dataConfidence?: number;
}

export const Passive_earth_pressure_calculatorInputSchema = z.object({
  soilUnitWeight: z.number().default(18),
  heightOfWall: z.number().default(5),
  frictionAngle: z.number().default(30),
  cohesion: z.number().default(0),
  surcharge: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Passive_earth_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.soilUnitWeight * input.heightOfWall * input.frictionAngle * input.cohesion; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.soilUnitWeight * input.heightOfWall * input.frictionAngle * input.cohesion * (input.surcharge); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.surcharge; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePassive_earth_pressure_calculator(input: Passive_earth_pressure_calculatorInput): Passive_earth_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Passive_earth_pressure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
