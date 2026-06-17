// @ts-nocheck
// Auto-generated from passive-earth-pressure-calculator-schema.json
import * as z from 'zod';

export interface Passive_earth_pressure_calculatorInput {
  soilUnitWeight: number;
  heightOfWall: number;
  frictionAngle: number;
  cohesion: number;
  surcharge: number;
}

export const Passive_earth_pressure_calculatorInputSchema = z.object({
  soilUnitWeight: z.number().default(18),
  heightOfWall: z.number().default(5),
  frictionAngle: z.number().default(30),
  cohesion: z.number().default(0),
  surcharge: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Passive_earth_pressure_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.soilUnitWeight + input.heightOfWall + input.frictionAngle; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.soilUnitWeight + input.heightOfWall + input.frictionAngle; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePassive_earth_pressure_calculator(input: Passive_earth_pressure_calculatorInput): Passive_earth_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
